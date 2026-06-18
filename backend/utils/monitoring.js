const logger = require('./logger');

class MonitoringService {
    constructor() {
        this.metrics = {
            requests: {
                total: 0,
                success: 0,
                error: 0,
                byEndpoint: {}
            },
            database: {
                queries: 0,
                errors: 0,
                avgResponseTime: 0
            },
            payments: {
                total: 0,
                success: 0,
                failed: 0,
                totalAmount: 0
            },
            system: {
                memoryUsage: 0,
                cpuUsage: 0,
                uptime: 0
            }
        };
        this.startTime = Date.now();
    }

    // Track HTTP requests
    trackRequest(method, endpoint, statusCode, responseTime) {
        this.metrics.requests.total++;
        
        if (statusCode >= 200 && statusCode < 400) {
            this.metrics.requests.success++;
        } else {
            this.metrics.requests.error++;
        }

        const key = `${method} ${endpoint}`;
        if (!this.metrics.requests.byEndpoint[key]) {
            this.metrics.requests.byEndpoint[key] = {
                count: 0,
                success: 0,
                error: 0,
                avgResponseTime: 0
            };
        }

        const endpointMetric = this.metrics.requests.byEndpoint[key];
        endpointMetric.count++;
        
        if (statusCode >= 200 && statusCode < 400) {
            endpointMetric.success++;
        } else {
            endpointMetric.error++;
        }

        // Calculate average response time
        endpointMetric.avgResponseTime = 
            (endpointMetric.avgResponseTime * (endpointMetric.count - 1) + responseTime) / endpointMetric.count;
    }

    // Track database operations
    trackDatabaseQuery(success, responseTime) {
        this.metrics.database.queries++;
        
        if (success) {
            this.metrics.database.avgResponseTime = 
                (this.metrics.database.avgResponseTime * (this.metrics.database.queries - 1) + responseTime) / this.metrics.database.queries;
        } else {
            this.metrics.database.errors++;
        }
    }

    // Track payments
    trackPayment(success, amount) {
        this.metrics.payments.total++;
        
        if (success) {
            this.metrics.payments.success++;
            this.metrics.payments.totalAmount += amount;
        } else {
            this.metrics.payments.failed++;
        }
    }

    // Get system metrics
    getSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        
        this.metrics.system.memoryUsage = memoryUsage.heapUsed / 1024 / 1024; // MB
        this.metrics.system.cpuUsage = cpuUsage.user / 1000000; // seconds
        this.metrics.system.uptime = (Date.now() - this.startTime) / 1000; // seconds

        return this.metrics.system;
    }

    // Get all metrics
    getAllMetrics() {
        this.getSystemMetrics();
        return {
            ...this.metrics,
            uptime: this.metrics.system.uptime
        };
    }

    // Log metrics periodically
    logMetrics() {
        const metrics = this.getAllMetrics();
        logger.info('System Metrics', {
            requests: metrics.requests,
            database: metrics.database,
            payments: metrics.payments,
            system: metrics.system
        });
    }

    // Reset metrics (useful for testing or periodic resets)
    resetMetrics() {
        this.metrics = {
            requests: {
                total: 0,
                success: 0,
                error: 0,
                byEndpoint: {}
            },
            database: {
                queries: 0,
                errors: 0,
                avgResponseTime: 0
            },
            payments: {
                total: 0,
                success: 0,
                failed: 0,
                totalAmount: 0
            },
            system: {
                memoryUsage: 0,
                cpuUsage: 0,
                uptime: 0
            }
        };
        this.startTime = Date.now();
    }
}

module.exports = new MonitoringService();
