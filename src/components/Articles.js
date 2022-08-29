import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import Badges from './Badges';

const Articles = ({ title, category, description, id, imageUrl, excerpt }) => {
  return (
    <>
      <Box display="inline-block" textAlign="center">
        <Grid container spacing={2}>
          <Grid item >
            <Card sx={{ maxWidth: "22rem", margin: 2 }}>
              <CardMedia
                component="img"
                image={imageUrl}
                alt={title}
                position='top'
                sx={{ maxWidth: "100%", height: "180px" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {excerpt(description)}
                  <Link style={{ textDecoration: "none", color: "blue" }} to={`/article/${id}/`}>Read More</Link>
                </Typography>
              </CardContent>
              <Badges>{category}</Badges>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Articles;