import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Badges from '../Badges';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Article = () => {
  const [article, setArticle] = useState();
  const { id } = useParams();
  

  useEffect(() => {
    if (id) {
      getSingleArticle();
    }
    document.title = "ANAtOLIA | Article " + id;
    // eslint-disable-next-line
  }, [id]);

  const getSingleArticle = async () => {
    const response = await axios.get(`https://my-json-server.typicode.com/rizzingrezz/test-json/articles/${id}`);
    if (response.status === 200) {
      setArticle(response.data);
    } else {
      toast.error("Something went wrong");
    }
  };

  const styleInfo = {
    marginLeft: "5px",
    float: "right",
    marginTop: "20px"
  }
  return (
    <Container sx={{ border: "1px solid #d1ebe8" }}>
      <Link to="/">
        <strong style={{ float: "left", color: "black" }}>
          Go Back
        </strong>
      </Link>
      <Typography variant="h3" sx={{ textAlign: "center" }}>{article && article.title}</Typography>
      <img
        src={article && article.imageUrl}
        className="img-fluid rounded"
        alt={article && article.title}
        style={{ width: "100%", maxHeight: "500px" }}
      />
      <div style={{ marginTop: "20px" }}>
        <div style={{ height: "43px", background: "#f6f6f6", overflow: "hidden" }}>
          <CalendarMonthIcon style={{ float: "left", marginTop: "10px" }} />
          <strong style={{ float: "left", marginTop: "12px", marginLeft: "2px" }}>
            {article && article.date}
          </strong>
          <Badges style={{ marginLeft: "" }} styleInfo={styleInfo}>{article && article.category}</Badges>
        </div>
        <Typography sx={{ whiteSpace: "pre-line", my: 3 }}>
          {article && article.description}
        </Typography>
      </div>
    </Container>
  )
}

export default Article;