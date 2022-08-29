import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import Articles from '../components/Articles';

const Cards = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        loadArticlesData();
    }, []);

    const loadArticlesData = async () => {
        const response = await axios.get("https://my-json-server.typicode.com/rizzingrezz/test-json/articles/");
        if (response.status === 200) {
            setData(response.data);
        } else {
            toast.error("Something went wrong");
        }
    };

    const excerpt = (str) => {
        if (str.length > 50) {
            str = str.substring(0, 50) + "...";
        }
        return str;
    };

    return (
        <Grid>
            {data.length === 0 && (
                <Typography sx={{ textAlign: "center", my: 2 }}>
                    No Articles Found
                </Typography>
            )}
            <Grid item sx={{ textAlign: "center", my: 4 }}>
                {data && data.map((item, index) => (
                    <Articles
                        key={index}
                        {...item}
                        excerpt={excerpt} />
                )).reverse()}
            </Grid>
        </Grid>
    )
}

export default Cards;