// Phase 3: Worldwide Rules Engine

class RulesEngine {
  constructor() {
    // In production, this would be fetched from PostgreSQL.
    // For now, we mock the Worldwide Rules database.
    this.ruleSets = {
      'us-passport': {
        country: 'USA',
        document: 'Passport',
        width_px: 600,
        height_px: 600,
        dpi: 300,
        background: 'white',
        headRatioMin: 0.50,
        headRatioMax: 0.69,
        eyePositionMin: 0.56,
        eyePositionMax: 0.69, // measured from bottom
        allowedFormats: ['jpg', 'jpeg'],
        maxFileSizeKB: 240
      },
      'india-passport': {
        country: 'India',
        document: 'Passport',
        width_mm: 35,
        height_mm: 45,
        dpi: 300,
        background: 'white',
        headRatioMin: 0.70,
        headRatioMax: 0.80,
        allowedFormats: ['jpg', 'jpeg']
      }
    };
  }

  getRuleSet(documentId) {
    const rules = this.ruleSets[documentId];
    if (!rules) throw new Error(`No rules found for document: ${documentId}`);
    return rules;
  }

  validateCompliance(imageMetadata, faceData, documentId) {
    const rules = this.getRuleSet(documentId);
    const results = {
      score: 100,
      checks: []
    };

    // 1. Resolution & Size Check
    if (rules.width_px && (imageMetadata.width < rules.width_px || imageMetadata.height < rules.height_px)) {
      results.score -= 20;
      results.checks.push({ name: 'resolution', status: 'FAIL', message: 'Image resolution too low for this document.' });
    } else {
      results.checks.push({ name: 'resolution', status: 'PASS' });
    }

    // 2. Face Presence
    if (!faceData || faceData.facesCount !== 1) {
      results.score -= 50;
      results.checks.push({ name: 'face_count', status: 'FAIL', message: 'Exactly one face must be visible.' });
      return results; // Critical failure
    }

    // 3. Head Ratio Check
    const faceHeight = faceData.bbox.height;
    const headRatio = faceHeight / imageMetadata.height;
    
    if (rules.headRatioMin && rules.headRatioMax) {
      if (headRatio < rules.headRatioMin) {
        results.score -= 15;
        results.checks.push({ name: 'head_size', status: 'FAIL', message: 'Face is too small. Please crop closer.' });
      } else if (headRatio > rules.headRatioMax) {
        results.score -= 15;
        results.checks.push({ name: 'head_size', status: 'FAIL', message: 'Face is too large. Please zoom out.' });
      } else {
        results.checks.push({ name: 'head_size', status: 'PASS' });
      }
    }

    // 4. Background Check (Simulated)
    if (imageMetadata.backgroundDetected !== rules.background) {
      results.score -= 10;
      results.checks.push({ name: 'background', status: 'WARNING', message: `Background should be ${rules.background}.` });
    } else {
      results.checks.push({ name: 'background', status: 'PASS' });
    }

    // 5. Pose Check (Yaw, Pitch, Roll)
    if (Math.abs(faceData.pose.yaw) > 5 || Math.abs(faceData.pose.pitch) > 5) {
      results.score -= 15;
      results.checks.push({ name: 'pose', status: 'WARNING', message: 'Please look directly at the camera.' });
    } else {
      results.checks.push({ name: 'pose', status: 'PASS' });
    }

    // Determine final status
    results.status = results.score >= 90 ? 'PASS' : (results.score >= 70 ? 'WARNING' : 'FAIL');

    return results;
  }
}

module.exports = new RulesEngine();
