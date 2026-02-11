import api from '../api/axios';

const ReportService = {
    // Generate reports
    generateSystemReport: () => {
        return api.post('/admin/reports/generate');
    },

    generateUserActivityReport: () => {
        return api.post('/admin/reports/user-activity');
    },

    generateTransactionReport: () => {
        return api.post('/admin/reports/transactions');
    },

    generateSupplyChainReport: () => {
        return api.post('/admin/reports/supply-chain');
    },

    generateDisputeReport: () => {
        return api.post('/admin/reports/disputes');
    },

    // Get all reports
    getAllReports: () => {
        return api.get('/admin/reports');
    },

    // Get report by ID
    getReportById: (id) => {
        return api.get(`/admin/reports/${id}`);
    },

    // Delete report
    deleteReport: (id) => {
        return api.delete(`/admin/reports/${id}`);
    }
};

export default ReportService;
