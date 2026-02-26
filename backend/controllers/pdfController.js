const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// @desc    Upload PDF and extract text
// @route   POST /api/pdf/upload
// @access  Private
const uploadPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        await parser.destroy();

        // Remove the uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            text: data.text,
            info: data.metadata?.info, // Adjust based on v2 result structure if needed
            numpages: data.pages.length
        });
    } catch (error) {
        console.error('PDF Extraction Error:', error.message);
        // Clean up even if extraction fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: `Failed to extract text from PDF: ${error.message}` });
    }
};

module.exports = { uploadPdf };
