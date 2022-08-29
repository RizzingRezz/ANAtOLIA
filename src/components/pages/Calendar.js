import React, { useEffect } from 'react';
import '../../App.css';

export default function Calendar() {
  useEffect(() => {
    document.title = "ANAtOLIA | Calendar"
  }, [])
  return (
    <>
      <div className='calendar'>
        <h1 >Calendar</h1>
        <p>The ANAtOLIA project is divided in 27 work packages spread over 4 years and including 8 different milestones. The Gantt diagram shown
          below present the calendar of the project with all work packages.</p>
        <p>The 2 first years are dedicated to the preliminary study of useful parameters, databases, and the monitor able to measure them.
          In this period, we will also be focused on the selection of location to monitor and on the design and manufacture of the CATM-GSE station.</p>
        <p id='last'>The last 2 years will be dedicated to the monitoring campaign, to the data analysis and to the correlation with other sources of data.</p>
        <img className='calendar' src='/images/calendar.png' alt='calendar'></img>
      </div>
    </>
  );
}
