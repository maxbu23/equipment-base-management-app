import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef();

  useEffect(() => {
    Quagga.init({
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: "200",
                height: "500",
                facingMode: "environment"
              },
              
            },
            decoder: {
              readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"],
            },
            locate: true,
          }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      onDetected(data.codeResult.code);
      Quagga.stop();
    });

    return () => {
      Quagga.stop();
    };
  }, [onDetected]);

  return <div ref={scannerRef} />;
};

export default BarcodeScanner;
