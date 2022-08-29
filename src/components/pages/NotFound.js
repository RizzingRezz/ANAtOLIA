import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        document.title = "ANAtOLIA | Page Not Found"
      }, [])
    return (
        <div style={{textAlign:"center",padding:5}}>
            <h1>Page Not Found</h1>
            <Link to="/">Go Back to home</Link>
        </div>
    )
}

export default NotFound;