import React, { useEffect } from 'react';
import '../../App.css';

export default function Consortium() {
    useEffect(() => {
        document.title = "ANAtOLIA | Consortium"
      }, [])
    return (
        <>
            <div className='consortium'>
                <h1 >Consortium</h1>
                <p>The consortium leading this ANAtOLIA project is composed of the following european partners (see figure below):</p>
                <ul>
                    <li>CNRS-OCA-Lagrange Laboratory</li>
                    <li>CNRS-LatmosAirbus DS FR (ADS-FR)</li>
                    <li>Thales Alenia Space (TAS)</li>
                    <li>Norway University (NTNU)</li>
                    <li>CNRS-ICARE/AERIS</li>
                    <li>OCA-Lagrange Technical Direction</li>
                    <li>Reuniwatt</li>
                    <li>Cimel</li>
                </ul>
                <img className='presentation' src='/images/Organigramme.png' alt='Organigramme'></img>
            </div>
        </>
    );
}