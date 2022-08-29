import React, { useEffect } from 'react';
import '../../App.css';

export default function Instruments() {
  useEffect(() => {
    document.title = "ANAtOLIA | Instruments"
  }, [])
  return (
    <>
      <div className='instruments'>
        <h1 >Instruments</h1>
        <p>The Generalized monitor of Turbulence (GMT) is the instrument dedicated to the measurement of optical turbulence conditions.
          It is based on the method used by two other well-known and performant instruments: the Generalized Differential Image Motion Monitor (GDIMM)
          and the Profiler of Moon Limb (PML).</p>
        <p>The GDIMM method is partly based on the well-known DIMM method which consists of measuring the differential variations of a given bright
          star passing through two different sub-apertures of 6cm diameter. This method allows the instrument to deduce the integrated seeing and
          Fried parameter. In addition to the DIMM method, the GDIMM has a third 10cm diameter sub-aperture with a 4cm central obscuration which
          allow to deduce also the isoplanatic angle, the wavefront outer scale and the coherence time.
        </p>
        <p>In its PML mode, the GMT used an optical method based on the observation of the Sun or Moon limb to deduce the vertical profile of
          the turbulent energy called Cn2. Indeed, the limb offer the advantage of offering all angular separations needed between two points of
          the limb, which is equivalent to have a continuum of double stars. From each double star the instrument uses the same differential method
          than the DIMM through the two small sub-apertures (6cm diameter). From these sub-apertures we acquire two images of the limb.
          The angular correlation of the differential distance along the limb between the two images of the limb allows to deduce the vertical
          profile of the turbulence energy Cn2(h). This method is the one giving currently the best resolution scanning the whole atmosphere
          (33 layers between 0 and 24km with a resolution of ~100 near the ground). In addition, other turbulence parameters
          (seeing, isoplanatic angle, scintillation, …) are also deduced either from the images or from the Cn2 profile. One of the best advantages
          of this method in the ANAtOLIA project is that it can works during both daytime and nighttime with the same instrument, giving access to
          turbulence conditions during the day.</p>
      </div>
    </>
  );
}