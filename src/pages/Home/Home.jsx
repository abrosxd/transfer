import React, { useEffect, useState } from "react";
import { useSettings } from "../../utils/Settings";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Modal = ({ article, onClose }) => {
  const { title, text, photo } = article;

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const images = photo.map((img) => ({
    src: img.url,
  }));

  const openGallery = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="gallery">
          {photo && photo.length > 0 ? (
            photo.map((img, index) => (
              <div
                key={index}
                className="gallery-image"
                onClick={() => openGallery(index)}
              >
                <img
                  src={img.thumbnails?.large?.url || img.url}
                  alt={`Image ${index}`}
                />
              </div>
            ))
          ) : (
            <p>Нет изображений</p>
          )}
        </div>
      </div>

      {isOpen && (
        <Lightbox
          slides={images}
          open={isOpen}
          close={() => setIsOpen(false)}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
        />
      )}
    </div>
  );
};

const ArticleCard = ({ title, cover, onClick }) => (
  <div className="card" onClick={onClick}>
    {title && <h3>{title}</h3>}
    {cover && <img src={cover} alt={title} />}
  </div>
);

export default function Home() {
  const { apiKey, baseId, tableArticles, tableReviews, fetchTableData } =
    useSettings();

  const [articles, setArticles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const fetchedReviews = await fetchTableData(
          apiKey,
          baseId,
          tableReviews
        );
        const reviewsData = fetchedReviews.map((record) => ({
          name: record.Name,
          review: record.Review,
        }));
        setReviews(reviewsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных из Airtable:", error);
      }
    };
    loadReviews();

    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchTableData(
          apiKey,
          baseId,
          tableArticles
        );

        const articlesData = fetchedArticles.map((record) => ({
          title: record.Название || "Без названия",
          cover: record.Обложка?.[0]?.url || "",
          text: record.Статья || "Текста нет",
          photo: record.Фотографии || [],
        }));

        setArticles(articlesData);
      } catch (error) {
        console.error("Ошибка при загрузке данных из Airtable:", error);
      }
    };
    loadArticles();
  }, [apiKey, baseId, tableArticles, tableReviews, fetchTableData]);

  const handleCardClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <main className="home">
      <div className="hello">
        <h1>Tip Top - твой лучший помощник в пути!</h1>
        <div className="bg">
          <img className="jellyfish" src="/assets/jellyfish.gif" />
          <img className="pup" src="/assets/pup.gif" />
          <img className="star" src="/assets/star.gif" />
        </div>
      </div>
      <div className="reviews">
        <h2>Отзывы</h2>
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          navigation
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={reviews.length > 3}
          breakpoints={{
            1200: { slidesPerView: 3 },
            767: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="card">
                <h3>{review.name}</h3>
                <p>{review.review}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="articles">
        <h2>Полезная информация</h2>
        <div className="container">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <ArticleCard
                key={index}
                {...article}
                onClick={() => handleCardClick(article)}
              />
            ))
          ) : (
            <p>Нет статей для отображения</p>
          )}
        </div>
      </div>
      {selectedArticle && (
        <Modal article={selectedArticle} onClose={handleCloseModal} />
      )}
    </main>
  );
}
