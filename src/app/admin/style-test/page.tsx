"use client";

import { useState } from "react";

const SHAPE_STYLES = [
  'square', 'rounded', 'dots', 'classy', 'classy-rounded',
  'extra-rounded', 'horizontal-rounded', 'vertical-rounded', 'ribbon',
  'diamond-special', 'star', 'diamond', 'x', 'x-rounded',
  'cross', 'cross-rounded', 'heart', 'sparkle', 'shake',
];

const CORNER_SQUARE_STYLES = [
  'default', 'dot', 'square', 'extra-rounded',
  'shape1', 'shape2', 'shape3', 'shape4', 'shape5',
  'shape6', 'shape7', 'shape8', 'shape9', 'shape10', 'shape11',
];

const CORNER_DOT_STYLES = [
  'default', 'dot', 'rounded', 'dot2', 'dot3', 'dot4',
  'star', 'diamond', 'x', 'cross', 'sun',
  'square2', 'square3', 'cross-rounded', 'x-rounded', 'heart',
];

export default function StyleTestPage() {
  const [shapeImages, setShapeImages] = useState<Record<string, string>>({});
  const [cornerSquareImages, setCornerSquareImages] = useState<Record<string, string>>({});
  const [cornerDotImages, setCornerDotImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const generatePreview = async (
    styleName: string,
    styleType: 'shape' | 'corner-square' | 'corner-dot'
  ) => {
    setLoading(`${styleType}-${styleName}`);

    const design: Record<string, any> = {
      dotsType: styleType === 'shape' ? styleName : 'square',
      cornersSquareType: styleType === 'corner-square' ? styleName : 'default',
      cornersDotType: styleType === 'corner-dot' ? styleName : 'default',
      dotsColor: '#000000',
      backgroundColor: '#FFFFFF',
      cornersSquareColor: '#000000',
      cornersDotColor: '#000000',
    };

    try {
      const res = await fetch('/api/qrcodes/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'website',
          content: { url: 'https://example.com' },
          design,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (styleType === 'shape') {
          setShapeImages(prev => ({ ...prev, [styleName]: url }));
        } else if (styleType === 'corner-square') {
          setCornerSquareImages(prev => ({ ...prev, [styleName]: url }));
        } else {
          setCornerDotImages(prev => ({ ...prev, [styleName]: url }));
        }
      }
    } catch (error) {
      console.error(`Failed to generate ${styleType}/${styleName}:`, error);
    }

    setLoading(null);
  };

  const generateAll = async (styleType: 'shape' | 'corner-square' | 'corner-dot') => {
    const styles = styleType === 'shape'
      ? SHAPE_STYLES
      : styleType === 'corner-square'
        ? CORNER_SQUARE_STYLES
        : CORNER_DOT_STYLES;

    for (const style of styles) {
      await generatePreview(style, styleType);
      // Delay between requests
      await new Promise(r => setTimeout(r, 1000));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">QRFY Style Mapping Test</h1>
      <p className="mb-4 text-gray-600">
        Compare these QR codes to the SVG thumbnails in the UI to find the correct mapping.
      </p>

      {/* Shapes */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Shape Styles (API names)</h2>
          <button
            onClick={() => generateAll('shape')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm"
          >
            Generate All Shapes
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {SHAPE_STYLES.map((style, idx) => (
            <div key={style} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
              <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded">
                {shapeImages[style] ? (
                  <img src={shapeImages[style]} alt={style} className="w-full h-full object-contain" />
                ) : loading === `shape-${style}` ? (
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <button
                    onClick={() => generatePreview(style, 'shape')}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Generate
                  </button>
                )}
              </div>
              <span className="text-xs font-medium text-center">{idx + 1}. {style}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Corner Squares */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Corner Square Styles (API names)</h2>
          <button
            onClick={() => generateAll('corner-square')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm"
          >
            Generate All
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {CORNER_SQUARE_STYLES.map((style, idx) => (
            <div key={style} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
              <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded">
                {cornerSquareImages[style] ? (
                  <img src={cornerSquareImages[style]} alt={style} className="w-full h-full object-contain" />
                ) : loading === `corner-square-${style}` ? (
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <button
                    onClick={() => generatePreview(style, 'corner-square')}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Generate
                  </button>
                )}
              </div>
              <span className="text-xs font-medium text-center">{idx + 1}. {style}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Corner Dots */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Corner Dot Styles (API names)</h2>
          <button
            onClick={() => generateAll('corner-dot')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm"
          >
            Generate All
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {CORNER_DOT_STYLES.map((style, idx) => (
            <div key={style} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
              <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded">
                {cornerDotImages[style] ? (
                  <img src={cornerDotImages[style]} alt={style} className="w-full h-full object-contain" />
                ) : loading === `corner-dot-${style}` ? (
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <button
                    onClick={() => generatePreview(style, 'corner-dot')}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Generate
                  </button>
                )}
              </div>
              <span className="text-xs font-medium text-center">{idx + 1}. {style}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">How to use:</h3>
        <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
          <li>Click &quot;Generate All&quot; for each section (or generate individually)</li>
          <li>Compare the generated QR codes to the SVG thumbnails in the QR editor</li>
          <li>Note which API style name matches which numbered SVG from our JSON</li>
          <li>Share the mapping so I can update the code</li>
        </ol>
      </div>
    </div>
  );
}
