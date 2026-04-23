import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';

// Define styles for the PDF components
const styles = StyleSheet.create({
  barcodeContainer: {
    margin: 5,
    padding: 5,
    width: 150, // Adjust width as needed
    height: 50, // Adjust height as needed
  },
  image: {
    width: '150px',
    height: '50px',
  },
});

/**
 * Barcode component for react-pdf
 * @param {string} value The value to encode in the barcode
 * @param {object} options JsBarcode options (format, width, height, etc.)
 */
const BarcodeForPDF = ({ value, options = {} }) => {
  const [barcodeSrc, setBarcodeSrc] = useState('');

  useEffect(() => {
    // This runs client-side when the component mounts
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, value, {
        format: 'CODE128', // Default format, can be overridden by options
        ...options,
      });
      // Convert the canvas to a PNG data URL, which react-pdf supports
      const dataUrl = canvas.toDataURL('image/png');
      setBarcodeSrc(dataUrl);
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  }, [value, options]); // Re-run if value or options change

  // Only render the Image once the source is available
  if (!barcodeSrc) {
    return null;
  }

  return (
    <View style={styles.barcodeContainer}>
      {/* Use react-pdf's Image component with the data URL */}
      <Image src={barcodeSrc} style={styles.image} />
    </View>
  );
};

export default BarcodeForPDF;