import {
    FilePlus2, Divide, FileDown, RotateCw, Trash2, ArrowRightLeft,
    FileText, FileImage, ShieldCheck, Unlock, Type, PenTool, Crop, Maximize, Edit3, Settings, PaintBucket
} from 'lucide-react';

export const TOOLS_CATEGORIES = [
    {
        title: "Organize PDF",
        tools: [
            { id: "merge-pdf", name: "Merge PDF", desc: "Combine PDFs in the order you want with the easiest PDF merger available.", icon: FilePlus2, color: "#E5322D", bgColor: "#ffe8e8" },
            { id: "split-pdf", name: "Split PDF", desc: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: Divide, color: "#FF6900", bgColor: "#fff0e5" },
            { id: "rotate-pdf", name: "Rotate PDF", desc: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!", icon: RotateCw, color: "#1976D2", bgColor: "#e8f1fa" },
            { id: "organize-pdf", name: "Organize PDF", desc: "Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.", icon: Settings, color: "#FF9800", bgColor: "#fff5e5" },
            { id: "delete-pdf-pages", name: "Delete PDF Pages", desc: "Remove unwanted pages from your PDFs easily.", icon: Trash2, color: "#F44336", bgColor: "#ffebeb" }
        ]
    },
    {
        title: "Optimize PDF",
        tools: [
            { id: "compress-pdf", name: "Compress PDF", desc: "Reduce file size while optimizing for maximal PDF quality.", icon: FileDown, color: "#4CAF50", bgColor: "#ebf7ec" },
            { id: "grayscale-pdf", name: "Grayscale PDF", desc: "Convert all images and text in your PDF to grayscale.", icon: PaintBucket, color: "#607D8B", bgColor: "#eceff1" }
        ]
    },
    {
        title: "Convert to PDF",
        tools: [
            { id: "word-to-pdf", name: "Word to PDF", desc: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: FileText, color: "#1976D2", bgColor: "#e8f1fa" },
            { id: "excel-to-pdf", name: "Excel to PDF", desc: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileText, color: "#4CAF50", bgColor: "#ebf7ec" },
            { id: "ppt-to-pdf", name: "PPT to PDF", desc: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", icon: FileText, color: "#FF5252", bgColor: "#ffebeb" },
            { id: "jpg-to-pdf", name: "JPG to PDF", desc: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.", icon: FileImage, color: "#FFB300", bgColor: "#fff8e5" },
            { id: "html-to-pdf", name: "HTML to PDF", desc: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.", icon: FileText, color: "#8E24AA", bgColor: "#f4e9f7" }
        ]
    },
    {
        title: "Convert from PDF",
        tools: [
            { id: "pdf-to-word", name: "PDF to Word", desc: "Easily convert your PDF files into easy to edit DOC and DOCX documents.", icon: FileText, color: "#1976D2", bgColor: "#e8f1fa" },
            { id: "pdf-to-excel", name: "PDF to Excel", desc: "Pull data straight from PDFs into EXCEL spreadsheets in a few short seconds.", icon: FileText, color: "#4CAF50", bgColor: "#ebf7ec" },
            { id: "pdf-to-ppt", name: "PDF to PPT", desc: "Turn your PDF files into easy to edit PPT and PPTX slideshows.", icon: FileText, color: "#FF5252", bgColor: "#ffebeb" },
            { id: "pdf-to-jpg", name: "PDF to JPG", desc: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: FileImage, color: "#FFB300", bgColor: "#fff8e5" }
        ]
    },
    {
        title: "Security & Advanced Tools",
        tools: [
            { id: "protect-pdf", name: "Protect PDF", desc: "Encrypt your PDF with a password to prevent unauthorized access.", icon: ShieldCheck, color: "#F44336", bgColor: "#ffebeb" },
            { id: "unlock-pdf", name: "Unlock PDF", desc: "Remove password security from your PDFs.", icon: Unlock, color: "#F44336", bgColor: "#ffebeb" },
            { id: "add-watermark", name: "Add Watermark", desc: "Stamp an image or text over your PDF in seconds.", icon: Type, color: "#00BCD4", bgColor: "#e5f8fa" },
            { id: "edit-pdf", name: "Edit PDF", desc: "Add text, images, shapes or freehand annotations to a PDF document.", icon: Edit3, color: "#E91E63", bgColor: "#fde8ef" },
            { id: "sign-pdf", name: "Sign PDF", desc: "Sign yourself or request electronic signatures from others.", icon: PenTool, color: "#673AB7", bgColor: "#f0eaf8" },
            { id: "ocr-pdf", name: "OCR PDF", desc: "Convert scanned PDFs into searchable and text-selectable documents.", icon: FileText, color: "#009688", bgColor: "#e5f4f3" },
            { id: "crop-pdf", name: "Crop PDF", desc: "Crop PDF to a selected area, adjust margin size.", icon: Crop, color: "#4CAF50", bgColor: "#ebf7ec" },
            { id: "resize-pdf", name: "Resize PDF", desc: "Change standard page sizes (A4, Letter) of your PDF.", icon: Maximize, color: "#2196F3", bgColor: "#e8f4fd" },
            { id: "add-page-numbers", name: "Add Page Numbers", desc: "Add page numbers to your PDF document in seconds.", icon: Type, color: "#00BCD4", bgColor: "#e5f8fa" }
        ]
    }
];

export const getToolById = (id) => {
    for (const cat of TOOLS_CATEGORIES) {
        for (const tool of cat.tools) {
            if (tool.id === id) return tool;
        }
    }
    return null;
};
