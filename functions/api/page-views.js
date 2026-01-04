// POST /api/page-views - Track a page view
// GET /api/page-views - Get page view statistics

import { getD1Database, generateUUID, getCurrentTimestamp } from './lib/d1.js';
import { createCORSResponse, jsonResponse } from './lib/cors.js';

// POST /api/page-views - Track a page view
export async function onRequestPost(context) {
  const { request, env } = context;

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return createCORSResponse();
  }

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: 'Invalid JSON in request body' }, 400);
    }

    const db = getD1Database(env);
    const viewId = generateUUID();
    const timestamp = getCurrentTimestamp();

    // Extract user info from request headers or body
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || '';
    const path = body.path || '/';
    const userId = body.user_id || null;

    // Insert page view into D1
    const result = await db.prepare(
      `INSERT INTO page_views (
        id, path, user_id, user_agent, referer, timestamp, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      viewId,
      path,
      userId,
      userAgent.substring(0, 500), // Limit user agent length
      referer.substring(0, 500), // Limit referer length
      timestamp,
      timestamp
    ).run();

    if (!result.success) {
      console.error('Database error:', result.error);
      return jsonResponse({
        error: 'Database error',
        message: result.error?.message || 'Failed to log page view',
      }, 500);
    }

    return jsonResponse({
      success: true,
      view_id: viewId,
      timestamp: new Date(timestamp * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Page view tracking error:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

// GET /api/page-views - Get page view statistics
export async function onRequestGet(context) {
  const { request, env } = context;

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return createCORSResponse();
  }

  try {
    const db = getD1Database(env);
    const url = new URL(request.url);
    
    // Parse query parameters for date filtering
    const date = url.searchParams.get('date'); // YYYY-MM-DD format
    const startDate = url.searchParams.get('start_date'); // YYYY-MM-DD format
    const endDate = url.searchParams.get('end_date'); // YYYY-MM-DD format
    const days = url.searchParams.get('days'); // Number of days (e.g., 7, 30)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    // Build WHERE clause for date filtering
    let whereClause = '';
    let bindParams = [];
    
    if (date) {
      // Filter by specific date
      const startTimestamp = Math.floor(new Date(date + 'T00:00:00Z').getTime() / 1000);
      const endTimestamp = Math.floor(new Date(date + 'T23:59:59Z').getTime() / 1000);
      whereClause = 'WHERE timestamp >= ? AND timestamp <= ?';
      bindParams = [startTimestamp, endTimestamp];
    } else if (startDate && endDate) {
      // Filter by date range
      const startTimestamp = Math.floor(new Date(startDate + 'T00:00:00Z').getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endDate + 'T23:59:59Z').getTime() / 1000);
      whereClause = 'WHERE timestamp >= ? AND timestamp <= ?';
      bindParams = [startTimestamp, endTimestamp];
    } else if (days) {
      // Filter by last N days
      whereClause = 'WHERE timestamp > strftime(\'%s\', \'now\', \'-' + parseInt(days, 10) + ' days\')';
    } else {
      // Default: last 30 days for daily views
      whereClause = 'WHERE timestamp > strftime(\'%s\', \'now\', \'-30 days\')';
    }

    // Get total page views (with date filter if specified)
    const totalQuery = whereClause ? `SELECT COUNT(*) as count FROM page_views ${whereClause}` : 'SELECT COUNT(*) as count FROM page_views';
    const totalResult = await (bindParams.length > 0 
      ? db.prepare(totalQuery).bind(...bindParams).first()
      : db.prepare(totalQuery).first());
    const totalViews = totalResult?.count || 0;

    // Get unique visitors (with date filter if specified)
    const uniqueQuery = whereClause 
      ? `SELECT COUNT(DISTINCT COALESCE(user_id, user_agent)) as count FROM page_views ${whereClause}`
      : `SELECT COUNT(DISTINCT COALESCE(user_id, user_agent)) as count FROM page_views`;
    const uniqueVisitorsResult = await (bindParams.length > 0
      ? db.prepare(uniqueQuery).bind(...bindParams).first()
      : db.prepare(uniqueQuery).first());
    const uniqueVisitors = uniqueVisitorsResult?.count || 0;

    // Get views by path (with date filter if specified)
    const pathQuery = whereClause
      ? `SELECT path, COUNT(*) as count FROM page_views ${whereClause} GROUP BY path ORDER BY count DESC LIMIT ?`
      : `SELECT path, COUNT(*) as count FROM page_views GROUP BY path ORDER BY count DESC LIMIT ?`;
    const viewsByPath = await (bindParams.length > 0
      ? db.prepare(pathQuery).bind(...bindParams, limit).all()
      : db.prepare(pathQuery).bind(limit).all());

    // Get daily page views (with date filter if specified)
    const dailyQuery = whereClause
      ? `SELECT DATE(datetime(timestamp, 'unixepoch')) as date, COUNT(*) as count FROM page_views ${whereClause} GROUP BY date ORDER BY date DESC`
      : `SELECT DATE(datetime(timestamp, 'unixepoch')) as date, COUNT(*) as count FROM page_views GROUP BY date ORDER BY date DESC`;
    const dailyViews = await (bindParams.length > 0
      ? db.prepare(dailyQuery).bind(...bindParams).all()
      : db.prepare(dailyQuery).all());

    // Get recent page views (with date filter if specified)
    const recentQuery = whereClause
      ? `SELECT id, path, user_id, timestamp, created_at, datetime(timestamp, 'unixepoch') as date_time FROM page_views ${whereClause} ORDER BY timestamp DESC LIMIT ?`
      : `SELECT id, path, user_id, timestamp, created_at, datetime(timestamp, 'unixepoch') as date_time FROM page_views ORDER BY timestamp DESC LIMIT ?`;
    const recentViews = await (bindParams.length > 0
      ? db.prepare(recentQuery).bind(...bindParams, limit).all()
      : db.prepare(recentQuery).bind(limit).all());

    return jsonResponse({
      success: true,
      filters: {
        date: date || null,
        start_date: startDate || null,
        end_date: endDate || null,
        days: days || null,
      },
      summary: {
        total_views: totalViews,
        unique_visitors: uniqueVisitors,
        average_views_per_visitor: uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(2) : 0,
      },
      statistics: {
        views_by_path: viewsByPath.results || [],
        daily_views: dailyViews.results || [],
        recent_views: recentViews.results || [],
      },
    });
  } catch (error) {
    console.error('Page views API error:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

// Main handler - routes GET and POST requests
export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'GET') {
    return onRequestGet(context);
  } else if (request.method === 'POST') {
    return onRequestPost(context);
  } else if (request.method === 'OPTIONS') {
    return createCORSResponse();
  } else {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
}
