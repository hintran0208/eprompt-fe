import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Export content to different file formats
 */
export const exportToTxt = (content, filename = 'export.txt') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, filename);
};

export const exportToPdf = (content, filename = 'export.pdf', options = {}) => {
  const { enableMarkdown = false } = options;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;
  
  let yPosition = margin;
  const normalLineHeight = 7;
  const headingLineHeight = 10;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxYPosition = pageHeight - margin;

  const processContent = (text) => {
    if (!enableMarkdown) {
      return doc.splitTextToSize(text, maxLineWidth);
    }

    // Simple markdown parsing for PDF
    const lines = text.split('\n');
    const processedLines = [];

    lines.forEach(line => {
      // Handle headers
      if (line.startsWith('# ')) {
        processedLines.push({ text: line.substring(2), type: 'h1' });
      } else if (line.startsWith('## ')) {
        processedLines.push({ text: line.substring(3), type: 'h2' });
      } else if (line.startsWith('### ')) {
        processedLines.push({ text: line.substring(4), type: 'h3' });
      } else if (line.startsWith('**') && line.endsWith('**')) {
        processedLines.push({ text: line.substring(2, line.length - 2), type: 'bold' });
      } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
        processedLines.push({ text: line.substring(1, line.length - 1), type: 'italic' });
      } else {
        processedLines.push({ text: line, type: 'normal' });
      }
    });

    return processedLines;
  };

  const lines = processContent(content);

  if (!enableMarkdown) {
    // Original plain text handling
    lines.forEach((line) => {
      if (yPosition > maxYPosition) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += normalLineHeight;
    });
  } else {
    // Enhanced markdown handling
    lines.forEach((lineObj) => {
      if (yPosition > maxYPosition) {
        doc.addPage();
        yPosition = margin;
      }

      const wrappedLines = doc.splitTextToSize(lineObj.text || ' ', maxLineWidth);
      
      wrappedLines.forEach((wrappedLine) => {
        if (yPosition > maxYPosition) {
          doc.addPage();
          yPosition = margin;
        }

        // Set font style based on type
        switch (lineObj.type) {
          case 'h1':
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            break;
          case 'h2':
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            break;
          case 'h3':
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            break;
          case 'bold':
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            break;
          case 'italic':
            doc.setFontSize(12);
            doc.setFont(undefined, 'italic');
            break;
          default:
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
        }

        doc.text(wrappedLine, margin, yPosition);
        
        // Use appropriate line height
        const lineHeight = ['h1', 'h2', 'h3'].includes(lineObj.type) ? headingLineHeight : normalLineHeight;
        yPosition += lineHeight;

        // Reset font for next line
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
      });
    });
  }
  
  doc.save(filename);
};

export const exportToDoc = async (content, filename = 'export.docx', options = {}) => {
  try {
    const { enableMarkdown = false } = options;
    
    const processContent = (text) => {
      if (!enableMarkdown) {
        // Original plain text handling
        return text.split('\n').map(line => 
          new Paragraph({
            children: [
              new TextRun({
                text: line || ' ',
                font: 'Arial',
                size: 24, // 12pt font size (doubled for docx)
              }),
            ],
          })
        );
      }

      // Enhanced markdown handling
      const lines = text.split('\n');
      const paragraphs = [];

      lines.forEach(line => {
        let paragraph;

        // Handle headers
        if (line.startsWith('# ')) {
          paragraph = new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: line.substring(2),
                font: 'Arial',
                size: 32, // 16pt
                bold: true,
              }),
            ],
          });
        } else if (line.startsWith('## ')) {
          paragraph = new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: line.substring(3),
                font: 'Arial',
                size: 28, // 14pt
                bold: true,
              }),
            ],
          });
        } else if (line.startsWith('### ')) {
          paragraph = new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: line.substring(4),
                font: 'Arial',
                size: 26, // 13pt
                bold: true,
              }),
            ],
          });
        } else if (line.startsWith('**') && line.endsWith('**')) {
          // Bold text
          paragraph = new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2, line.length - 2),
                font: 'Arial',
                size: 24,
                bold: true,
              }),
            ],
          });
        } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          // Italic text
          paragraph = new Paragraph({
            children: [
              new TextRun({
                text: line.substring(1, line.length - 1),
                font: 'Arial',
                size: 24,
                italics: true,
              }),
            ],
          });
        } else {
          // Handle inline formatting within regular paragraphs
          const children = parseInlineMarkdown(line);
          paragraph = new Paragraph({
            children: children,
          });
        }

        paragraphs.push(paragraph);
      });

      return paragraphs;
    };

    // Helper function to parse inline markdown
    const parseInlineMarkdown = (text) => {
      const children = [];
      let currentText = text || ' ';
      
      // Simple regex patterns for inline formatting
      const boldPattern = /\*\*(.*?)\*\*/g;
      
      let lastIndex = 0;
      let match;
      
      // Process bold text
      while ((match = boldPattern.exec(currentText)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = currentText.substring(lastIndex, match.index);
          if (beforeText) {
            children.push(new TextRun({
              text: beforeText,
              font: 'Arial',
              size: 24,
            }));
          }
        }
        
        // Add bold text
        children.push(new TextRun({
          text: match[1],
          font: 'Arial',
          size: 24,
          bold: true,
        }));
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < currentText.length) {
        const remainingText = currentText.substring(lastIndex);
        if (remainingText) {
          children.push(new TextRun({
            text: remainingText,
            font: 'Arial',
            size: 24,
          }));
        }
      }
      
      // If no formatting was found, return simple text
      if (children.length === 0) {
        children.push(new TextRun({
          text: currentText,
          font: 'Arial',
          size: 24,
        }));
      }
      
      return children;
    };

    const paragraphs = processContent(content);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error creating DOC file:', error);
    throw new Error('Failed to create DOC file');
  }
};

export const exportAllContent = async (data, fileType, options = {}) => {
  const { basicPrompt, refinedPrompt, generatedContent } = data;
  const { enableMarkdown = false, baseFilename = 'eprompt-export' } = options;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  const sections = [];
  
  if (basicPrompt) {
    if (enableMarkdown) {
      sections.push(`# Basic Prompt\n\n${basicPrompt}\n\n`);
    } else {
      sections.push(`=== BASIC PROMPT ===\n\n${basicPrompt}\n\n`);
    }
  }
  
  if (refinedPrompt) {
    if (enableMarkdown) {
      sections.push(`# Refined Prompt\n\n${refinedPrompt}\n\n`);
    } else {
      sections.push(`=== REFINED PROMPT ===\n\n${refinedPrompt}\n\n`);
    }
  }
  
  if (generatedContent) {
    if (enableMarkdown) {
      sections.push(`# Generated Content\n\n${generatedContent}\n\n`);
    } else {
      sections.push(`=== GENERATED CONTENT ===\n\n${generatedContent}\n\n`);
    }
  }
  
  const fullContent = sections.join('\n');
  const filenameSuffix = enableMarkdown ? '-formatted' : '';
  const filename = `${baseFilename}${filenameSuffix}-${timestamp}.${fileType}`;
  
  switch (fileType) {
    case 'txt':
      exportToTxt(fullContent, filename);
      break;
    case 'pdf':
      exportToPdf(fullContent, filename, { enableMarkdown });
      break;
    case 'docx':
      await exportToDoc(fullContent, filename, { enableMarkdown });
      break;
    default:
      throw new Error('Unsupported file type');
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
