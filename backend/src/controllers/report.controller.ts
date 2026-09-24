import { Request, Response } from 'express';
import { Report } from '../models/Report';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetType, targetId, targetTitle, reason, description } = req.body;
    const reporterId = req.user!._id;

    if (!targetType || !targetId || !reason || !description) {
      res.status(400).json({
        success: false,
        message: 'Please provide all report details (targetType, targetId, reason, description).',
      });
      return;
    }

    const report = await Report.create({
      reporter: reporterId,
      targetType,
      targetId,
      targetTitle: targetTitle || '',
      reason,
      description: description.trim(),
      status: 'Pending',
    });

    const populatedReport = await Report.findById(report._id).populate('reporter', 'name email college');

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will review it shortly.',
      report: populatedReport,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit report.',
    });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const query: any = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reports.',
    });
  }
};

// @desc    Update report status and admin notes (Admin only)
// @route   PUT /api/reports/:id
// @access  Private (Admin)
export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
      return;
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully.',
      report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update report.',
    });
  }
};
