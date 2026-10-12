import React, { useState, useId } from 'react';
import {
  Upload,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  Info,
  Calendar,
  Compass,
  Sun,
  MapPin,
  Maximize2,
  Send,
  Eye,
  RefreshCw,
  Sliders
} from 'lucide-react';

export interface SpectralMetadata {
  operatorName: string;
  studentId: string;
  instrumentModel: string;
  instrumentSerial: string;
  calibrationPanelId: string;
  targetName: string;
  acquisitionDate: string;
  latitude: string;
  longitude: string;
  solarZenithAngle: string;
  solarAzimuthAngle: string;
  skyCondition: string;
  foreoptic: string;
  integrationTime: string;
  measurementType: 'Reflectance' | 'Raw_DN' | 'Radiance';
  fieldNotes: string;
}

interface SpectralDataPoint {
  wl: number;
  refl: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metrics?: {
    bandCount: number;
    minWl: number;
    maxWl: number;
    meanRefl: number;
    ndvi: number;
    waterBandIndex: number;
    redEdgePos: number;
  };
}

interface FieldDataIngestionProps {
  moduleNumber: number;
  onSubmissionSuccess?: (data: { metadata: SpectralMetadata; points: SpectralDataPoint[] }) => void;
}

export const FieldDataIngestion: React.FC<FieldDataIngestionProps> = ({
  moduleNumber,
  onSubmissionSuccess
}) => {
  const fileInputId = useId();
  const [metadata, setMetadata] = useState<SpectralMetadata>({
    operatorName: 'Elena Rostova',
    studentId: 'MSc-704-019',
    instrumentModel: 'ASD FieldSpec 4 Hi-Res (350–2500 nm)',
    instrumentSerial: 'FS4-HR-9421',
    calibrationPanelId: 'Spectralon 99% (SRT-99-050, Calib #8821)',
    targetName: 'Quercus robur (English Oak) mature canopy sunlit top',
    acquisitionDate: new Date().toISOString().slice(0, 16),
    latitude: '52.2053',
    longitude: '0.1218',
    solarZenithAngle: '34.5',
    solarAzimuthAngle: '162.0',
    skyCondition: 'Clear Sky (<10% cloud, cirrus-free)',
    foreoptic: '8° Bare Fiber Nadir',
    integrationTime: '17 ms (100 co-added scans)',
    measurementType: 'Reflectance',
    fieldNotes: 'Measurements acquired at 1.5 m above canopy under steady solar irradiance; dark current and Spectralon white reference refreshed every 8 minutes.'
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<SpectralDataPoint[] | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoverPoint, setHoverPoint] = useState<{ wl: number; refl: number; x: number; y: number } | null>(null);

  // Helper to validate and calculate spectral indices
  const validateSpectralFile = (
    meta: SpectralMetadata,
    points: SpectralDataPoint[]
  ): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Metadata Validation
    if (!meta.operatorName.trim()) errors.push('Operator / Student Name is required.');
    if (!meta.studentId.trim()) errors.push('Student ID is required.');
    if (!meta.instrumentModel.trim()) errors.push('Spectroradiometer Model is required.');
    if (!meta.calibrationPanelId.trim()) errors.push('Calibration Reference Panel ID is required.');
    if (!meta.targetName.trim()) errors.push('Target Name / Canopy description is required.');

    const lat = parseFloat(meta.latitude);
    const lon = parseFloat(meta.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a valid decimal number between -90 and 90.');
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      errors.push('Longitude must be a valid decimal number between -180 and 180.');
    }

    const sza = parseFloat(meta.solarZenithAngle);
    if (isNaN(sza) || sza < 0 || sza > 90) {
      errors.push('Solar Zenith Angle must be between 0° and 90°.');
    } else if (sza > 55) {
      warnings.push(`Solar Zenith Angle of ${sza}° exceeds CEOS recommended maximum (55°) for terrestrial spectroscopy (BRDF shadowing effects).`);
    }

    if (meta.skyCondition.toLowerCase().includes('overcast')) {
      warnings.push('Overcast illumination causes purely diffuse irradiance, invalidating directional reflectance factors (BRF).');
    }

    // 2. CSV Data Validation
    if (!points || points.length === 0) {
      errors.push('CSV data contains no valid numeric wavelength-reflectance rows.');
      return { isValid: false, errors, warnings };
    }

    if (points.length < 50) {
      errors.push(`Insufficient spectral channels: parsed only ${points.length} points (minimum 50 required for hyperspectral validation).`);
    }

    const minWl = points[0].wl;
    const maxWl = points[points.length - 1].wl;

    if (minWl > 450) {
      warnings.push(`Spectrum begins at ${minWl} nm; missing visible blue region (<450 nm).`);
    }
    if (maxWl < 900) {
      warnings.push(`Spectrum terminates at ${maxWl} nm; missing SWIR / NIR plateau.`);
    }

    // Check monotonic increasing wavelengths
    let isMonotonic = true;
    for (let i = 1; i < points.length; i++) {
      if (points[i].wl <= points[i - 1].wl) {
        isMonotonic = false;
        break;
      }
    }
    if (!isMonotonic) {
      errors.push('Wavelength column must be strictly monotonically increasing.');
    }

    // Calculate metrics
    let sumRefl = 0;
    let anomalousCount = 0;
    for (const pt of points) {
      sumRefl += pt.refl;
      if (pt.refl < -0.05 || pt.refl > 1.3) {
        anomalousCount++;
      }
    }

    if (anomalousCount > 5) {
      warnings.push(`Found ${anomalousCount} spectral channels with reflectance outside physical bounds [-0.05, 1.30]. Possible saturation or white reference drift.`);
    }

    const meanRefl = sumRefl / points.length;

    // Find reflectance near key wavelengths for indices
    const getNearRefl = (targetWl: number): number => {
      let closest = points[0];
      let minDiff = Math.abs(points[0].wl - targetWl);
      for (const p of points) {
        const diff = Math.abs(p.wl - targetWl);
        if (diff < minDiff) {
          minDiff = diff;
          closest = p;
        }
      }
      return closest.refl;
    };

    const r680 = getNearRefl(680);
    const r800 = getNearRefl(800);
    const r900 = getNearRefl(900);
    const r970 = getNearRefl(970);

    const ndvi = (r800 - r680) / Math.max(0.001, r800 + r680);
    const waterBandIndex = r900 > 0.01 ? r970 / r900 : 1.0;

    // Estimate Red Edge Position (maximum derivative between 680 and 740 nm)
    let maxSlope = -1;
    let redEdgePos = 705;
    for (let i = 1; i < points.length - 1; i++) {
      const p = points[i];
      if (p.wl >= 680 && p.wl <= 745) {
        const slope = (points[i + 1].refl - points[i - 1].refl) / (points[i + 1].wl - points[i - 1].wl);
        if (slope > maxSlope) {
          maxSlope = slope;
          redEdgePos = Math.round(p.wl);
        }
      }
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      metrics: {
        bandCount: points.length,
        minWl: Math.round(minWl),
        maxWl: Math.round(maxWl),
        meanRefl: Number(meanRefl.toFixed(3)),
        ndvi: Number(Math.max(-1, Math.min(1, ndvi)).toFixed(3)),
        waterBandIndex: Number(waterBandIndex.toFixed(3)),
        redEdgePos
      }
    };
  };

  // CSV parsing function
  const parseCSVContent = (content: string, name: string) => {
    const lines = content.split(/\r?\n/);
    const points: SpectralDataPoint[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#') || line.startsWith('//') || line.toLowerCase().startsWith('wavelength')) {
        continue;
      }

      // Support comma, tab, semicolon or whitespace delimiter
      const parts = line.split(/[,;\t\s]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const wl = parseFloat(parts[0]);
        let refl = parseFloat(parts[1]);

        if (!isNaN(wl) && !isNaN(refl)) {
          // If reflectance is in 0-100 percentage format, normalize to 0-1
          if (refl > 2.0 && refl <= 100.0) {
            refl = refl / 100;
          }
          points.push({ wl, refl });
        }
      }
    }

    setFileName(name);
    setParsedData(points);
    const validation = validateSpectralFile(metadata, points);
    setValidationResult(validation);
    setIsSubmitted(false);
  };

  // Load sample ASD raw spectral file
  const handleLoadSampleData = () => {
    // Generate realistic high-res ASD spectrum (350 to 2500 nm at 1nm resolution)
    const points: SpectralDataPoint[] = [];
    for (let wl = 350; wl <= 2500; wl += 2) {
      let refl = 0.05;
      if (wl < 500) {
        refl = 0.04 + 0.02 * Math.sin(wl * 0.02);
      } else if (wl <= 600) {
        // Green peak
        refl = 0.05 + 0.09 * Math.exp(-Math.pow((wl - 550) / 30, 2));
      } else if (wl <= 680) {
        // Red chlorophyll pit
        refl = 0.04 + 0.01 * Math.sin(wl * 0.03);
      } else if (wl <= 750) {
        // Steep red edge
        const t = (wl - 680) / 70;
        refl = 0.05 + 0.45 / (1 + Math.exp(-12 * (t - 0.45)));
      } else if (wl <= 1300) {
        // NIR plateau
        refl = 0.48 - 0.05 * Math.exp(-Math.pow((wl - 970) / 40, 2)) + 0.01 * Math.sin(wl * 0.05);
      } else if (wl <= 1800) {
        // SWIR-1
        refl = 0.32 - 0.15 * Math.exp(-Math.pow((wl - 1450) / 70, 2)) + 0.02 * Math.sin(wl * 0.03);
      } else {
        // SWIR-2
        refl = 0.18 - 0.12 * Math.exp(-Math.pow((wl - 1940) / 70, 2)) - 0.04 * Math.exp(-Math.pow((wl - 2250) / 60, 2));
      }

      // Add slight instrument noise
      const noise = (Math.random() - 0.5) * 0.006;
      points.push({ wl, refl: Math.max(0.01, Number((refl + noise).toFixed(4))) });
    }

    setFileName('ASD_FieldSpec4_Canopy_Sample_001.csv');
    setParsedData(points);
    const validation = validateSpectralFile(metadata, points);
    setValidationResult(validation);
    setIsSubmitted(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCSVContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCSVContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleMetadataChange = (field: keyof SpectralMetadata, val: string) => {
    const updated = { ...metadata, [field]: val };
    setMetadata(updated);
    if (parsedData) {
      setValidationResult(validateSpectralFile(updated, parsedData));
    }
  };

  const handleSubmit = () => {
    if (!validationResult?.isValid || !parsedData) return;
    setIsSubmitted(true);
    onSubmissionSuccess?.({ metadata, points: parsedData });
  };

  // Chart coordinate helpers
  const svgWidth = 850;
  const svgHeight = 280;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const minWl = parsedData && parsedData.length > 0 ? parsedData[0].wl : 350;
  const maxWl = parsedData && parsedData.length > 0 ? parsedData[parsedData.length - 1].wl : 2500;

  const getX = (wl: number) => padding.left + ((wl - minWl) / (maxWl - minWl)) * plotWidth;
  const getY = (refl: number) => padding.top + (1 - Math.max(0, Math.min(1.0, refl))) * plotHeight;

  const chartPath = parsedData
    ? parsedData.reduce((acc, pt, i) => {
        const x = getX(pt.wl);
        const y = getY(pt.refl);
        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '')
    : '';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-xs">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Module {moduleNumber} Ingestion Gateway
            </span>
            <span className="text-xs text-stone-500 font-medium">
              CEOS WGCV Cal/Val ISO 19115 Standard
            </span>
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Field Spectrometer Data &amp; Metadata Ingestion
          </h3>
          <p className="text-xs text-stone-500">
            Submit calibrated spectral reflectance observations with compliant geometry, calibration panel IDs, and meteorological parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleData}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Load Sample ASD Calibrated CSV</span>
        </button>
      </div>

      {/* Grid: Metadata Input Form (Left) & CSV Upload + Verification (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* METADATA FORM (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-900 pb-1 border-b border-stone-100">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>1. Mandatory Field Experiment Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Operator Name */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Student Operator Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.operatorName}
                onChange={(e) => handleMetadataChange('operatorName', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                placeholder="e.g. Elena Rostova"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Student ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.studentId}
                onChange={(e) => handleMetadataChange('studentId', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                placeholder="e.g. MSc-704-019"
              />
            </div>

            {/* Instrument Model */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Spectroradiometer Model <span className="text-rose-500">*</span>
              </label>
              <select
                value={metadata.instrumentModel}
                onChange={(e) => handleMetadataChange('instrumentModel', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="ASD FieldSpec 4 Hi-Res (350–2500 nm)">ASD FieldSpec 4 Hi-Res (350–2500 nm)</option>
                <option value="SVC HR-1024i Field Spectroradiometer">SVC HR-1024i Field Spectroradiometer</option>
                <option value="Spectral Evolution PSR-3500+">Spectral Evolution PSR-3500+</option>
                <option value="Ocean Insight Flame-S-VIS-NIR (350-1000 nm)">Ocean Insight Flame-S-VIS-NIR (350-1000 nm)</option>
                <option value="Custom Micro-Hyperspectral Radiometer">Custom Micro-Hyperspectral Radiometer</option>
              </select>
            </div>

            {/* Instrument Serial */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Instrument Serial Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.instrumentSerial}
                onChange={(e) => handleMetadataChange('instrumentSerial', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Target Description */}
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">
                Target Surface / Canopy Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.targetName}
                onChange={(e) => handleMetadataChange('targetName', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                placeholder="e.g. Winter Wheat (Triticum aestivum) canopy at booting stage"
              />
            </div>

            {/* Calibration Panel ID */}
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">
                White Reference Calibration Panel ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.calibrationPanelId}
                onChange={(e) => handleMetadataChange('calibrationPanelId', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                placeholder="e.g. Spectralon 99% (SRT-99-050, Serial #8821)"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Acquisition Timestamp (UTC / Local) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={metadata.acquisitionDate}
                onChange={(e) => handleMetadataChange('acquisitionDate', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Foreoptic */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Foreoptic Configuration <span className="text-rose-500">*</span>
              </label>
              <select
                value={metadata.foreoptic}
                onChange={(e) => handleMetadataChange('foreoptic', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="8° Bare Fiber Nadir">8° Bare Fiber Nadir</option>
                <option value="1° Telescopic Foreoptic">1° Telescopic Foreoptic</option>
                <option value="25° Pistol Grip">25° Pistol Grip</option>
                <option value="High-Intensity Plant Probe / Leaf Clip">High-Intensity Plant Probe / Leaf Clip</option>
                <option value="Cosine Diffuser (Irradiance Head)">Cosine Diffuser (Irradiance Head)</option>
              </select>
            </div>

            {/* GPS Latitude & Longitude */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                GPS Latitude (°N) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.0001"
                value={metadata.latitude}
                onChange={(e) => handleMetadataChange('latitude', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                GPS Longitude (°E) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.0001"
                value={metadata.longitude}
                onChange={(e) => handleMetadataChange('longitude', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Solar Zenith & Azimuth */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Solar Zenith Angle (SZA °) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="90"
                value={metadata.solarZenithAngle}
                onChange={(e) => handleMetadataChange('solarZenithAngle', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Optimal: &lt; 45°</span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Sky Condition &amp; Cloud Cover <span className="text-rose-500">*</span>
              </label>
              <select
                value={metadata.skyCondition}
                onChange={(e) => handleMetadataChange('skyCondition', e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Clear Sky (<10% cloud, cirrus-free)">Clear Sky (&lt;10% cloud, cirrus-free)</option>
                <option value="Scattered Cumulus (10-30% at distance)">Scattered Cumulus (10-30% at distance)</option>
                <option value="Thin Cirrus / Haze">Thin Cirrus / Haze</option>
                <option value="Overcast (Diffuse Only)">Overcast (Diffuse Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CSV FILE UPLOAD & VALIDATION STATUS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-900 pb-1 border-b border-stone-100">
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>2. Raw Spectral CSV Upload &amp; Validation</span>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-stone-300 hover:border-emerald-500 bg-stone-50 hover:bg-stone-50/80'
            }`}
          >
            <input
              type="file"
              id={fileInputId}
              accept=".csv,.txt,.asd,.asd.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor={fileInputId} className="cursor-pointer block space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-stone-800">
                {fileName ? fileName : 'Click to select or drag & drop CSV file'}
              </div>
              <p className="text-[11px] text-stone-500">
                Supports ASD FieldSpec ASCII, SVC, and comma/tab-delimited files with [Wavelength, Reflectance] columns.
              </p>
            </label>
          </div>

          {/* Validation Checklist & Report */}
          {validationResult && (
            <div className="p-4 rounded-xl border space-y-3 text-xs bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="font-bold text-stone-800">Validation Protocol Status:</span>
                {validationResult.isValid ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED: CEOS Validated</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>FAILED: Missing Required Fields</span>
                  </span>
                )}
              </div>

              {/* Error messages */}
              {validationResult.errors.length > 0 && (
                <div className="space-y-1 text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-[11px]">
                  <strong className="block font-bold">Required Corrections:</strong>
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warning messages */}
              {validationResult.warnings.length > 0 && (
                <div className="space-y-1 text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px]">
                  <strong className="block font-bold">Scientific Quality Advisories:</strong>
                  {validationResult.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Calculated Physical Metrics */}
              {validationResult.metrics && (
                <div className="pt-1 space-y-2">
                  <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px] block">
                    Calculated Spectral Signatures &amp; Band Metrics:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-stone-50 rounded border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Bands Count</span>
                      <strong className="text-stone-900">{validationResult.metrics.bandCount.toLocaleString()} channels</strong>
                    </div>
                    <div className="p-2 bg-stone-50 rounded border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Wavelength Span</span>
                      <strong className="text-stone-900">{validationResult.metrics.minWl} – {validationResult.metrics.maxWl} nm</strong>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                      <span className="text-emerald-700 block text-[10px]">Normalized NDVI</span>
                      <strong className="text-emerald-900">{validationResult.metrics.ndvi}</strong>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                      <span className="text-emerald-700 block text-[10px]">Red Edge Position (REP)</span>
                      <strong className="text-emerald-900">{validationResult.metrics.redEdgePos} nm</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submission Action */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={!validationResult?.isValid || isSubmitted}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                isSubmitted
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : validationResult?.isValid
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Field Campaign Dataset Submitted &amp; Logged!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Field Dataset to Instructor Gradebook</span>
                </>
              )}
            </button>

            {isSubmitted && (
              <p className="text-[11px] text-emerald-800 text-center mt-2 font-medium">
                Receipt Token: #CEOS-M{moduleNumber}-{Math.random().toString(36).substring(2, 9).toUpperCase()} • Archived in Cohort Repository
              </p>
            )}
          </div>
        </div>
      </div>

      {/* INTERACTIVE SPECTRAL CURVE PREVIEW (If parsed) */}
      {parsedData && parsedData.length > 0 && (
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>3. Visual Verification: Parsed Field Spectrum ({fileName})</span>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Reflectance Range: 0.0 – 1.0 (350–2500 nm)
            </span>
          </div>

          <div className="bg-stone-900 rounded-xl p-4 overflow-x-auto relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const scale = svgWidth / rect.width;
                const svgX = mouseX * scale;

                if (svgX >= padding.left && svgX <= svgWidth - padding.right) {
                  const fraction = (svgX - padding.left) / plotWidth;
                  const wl = Math.round(minWl + fraction * (maxWl - minWl));
                  const pt = parsedData.find((p) => Math.abs(p.wl - wl) <= 3);
                  if (pt) {
                    setHoverPoint({ wl: pt.wl, refl: pt.refl, x: svgX, y: getY(pt.refl) });
                  }
                }
              }}
              onMouseLeave={() => setHoverPoint(null)}
            >
              {/* Atmospheric Water Absorption Masks */}
              <rect
                x={getX(1350)}
                y={padding.top}
                width={getX(1450) - getX(1350)}
                height={plotHeight}
                fill="#1e293b"
                opacity="0.7"
              />
              <rect
                x={getX(1800)}
                y={padding.top}
                width={getX(1950) - getX(1800)}
                height={plotHeight}
                fill="#1e293b"
                opacity="0.7"
              />

              {/* Grid lines */}
              <g stroke="#334155" strokeWidth="1" strokeDasharray="3 3">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((r) => (
                  <line key={r} x1={padding.left} y1={getY(r)} x2={svgWidth - padding.right} y2={getY(r)} />
                ))}
              </g>

              {/* Axes */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={svgHeight - padding.bottom}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <line
                x1={padding.left}
                y1={svgHeight - padding.bottom}
                x2={svgWidth - padding.right}
                y2={svgHeight - padding.bottom}
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Y Axis Labels */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((r) => (
                <text
                  key={r}
                  x={padding.left - 8}
                  y={getY(r) + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {(r * 100).toFixed(0)}%
                </text>
              ))}

              {/* X Axis Labels */}
              {[500, 700, 900, 1100, 1400, 1700, 2000, 2300].map((w) => (
                <g key={w}>
                  <line
                    x1={getX(w)}
                    y1={svgHeight - padding.bottom}
                    x2={getX(w)}
                    y2={svgHeight - padding.bottom + 5}
                    stroke="#64748b"
                  />
                  <text
                    x={getX(w)}
                    y={svgHeight - padding.bottom + 16}
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {w}
                  </text>
                </g>
              ))}

              {/* Spectral Path */}
              <path
                d={chartPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Indicator */}
              {hoverPoint && (
                <g>
                  <line
                    x1={hoverPoint.x}
                    y1={padding.top}
                    x2={hoverPoint.x}
                    y2={svgHeight - padding.bottom}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <circle cx={hoverPoint.x} cy={hoverPoint.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <rect
                    x={Math.min(svgWidth - 130, Math.max(padding.left + 5, hoverPoint.x - 60))}
                    y={padding.top + 5}
                    width="120"
                    height="32"
                    rx="6"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1"
                  />
                  <text
                    x={Math.min(svgWidth - 70, Math.max(padding.left + 65, hoverPoint.x))}
                    y={padding.top + 20}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {hoverPoint.wl} nm: {(hoverPoint.refl * 100).toFixed(1)}%
                  </text>
                  <text
                    x={Math.min(svgWidth - 70, Math.max(padding.left + 65, hoverPoint.x))}
                    y={padding.top + 31}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    Refl: {hoverPoint.refl.toFixed(4)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
