import React from 'react';
import { Badge } from '@mui/material';

const Category = ({ children, styleInfo }) => {
    const colorKey = {
        News: "warning",
        Explication: "success",
        Information: "danger"
    }
    return (
        <h5 style={styleInfo}>
            <Badge sx={{ py: 2}} badgeContent={children} color={colorKey[children]} />
        </h5>
    )
}

export default Category;