import placeImg from "../../assets/images/place.jpeg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
const PostList = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [posts,setPosts] = useState([]);
  const navigate = useNavigate()
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/posts?page=${currentPage}&q=${searchValue}`
        );
        console.log(response);
        const data = response.data.data;
        setPosts(data.posts);
        setTotalPage(data.pages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    };
    getPosts();
  }, [currentPage]);

  useEffect(() => {
    if (totalPage > 1) {
      let tempPageCount = [];

      for (let i = 1; i <= totalPage; i++) {
        tempPageCount = [...tempPageCount, i];
      }

      setPageCount(tempPageCount);
    } else {
      setPageCount([]);
    }
  }, [totalPage]);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((next) => next + 1);
  };

  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async (e) => {
    try {
      const input = e.target.value;
      setSearchValue(input);

      const resonse = await axios.get(
        `/posts?q=${input}&page=${currentPage}`
      );
      const data = resonse.data.data;
      setPosts(data.posts);
      setTotalPage(data.pages);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        // position : toast.POSITION.TOP_RIGHT,
        autoClose: true,
      });
    }
  };
  return (
    <div>
      <button className="button button-block" onClick={()=>navigate('new-post')}>Add New Post</button>
      <h2 className="table-title">Post List</h2>

      <input className="search-input" type="text" name="search" placeholder="Search here"  onChange={handleSearch}/>

      <div className="flexbox-container wrap">
      {loading ? "Loading...": (posts.map((post) => (
        <div className="post-card" key={post._id} onClick={() => navigate(`detail-post/${post._id}`)}>
          <h4 className="card-title">{post.title}</h4>
          {/* here only showing 50 characters in desc */}
          <p className="card-desc">{post.desc.substring(0,50)}</p> 
          {/* <img src={post.file} alt="mern" className="card-img" /> */}
        </div>
      )))}
          
      </div>
      {pageCount.length > 0 && (
        <div className="pag-container">
          <button
            className="pag-button"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {pageCount.map((pageNumber, index) => (
            <button
              className="pag-button"
              key={index}
              onClick={() => handlePage(pageNumber)}
              style={{
                backgroundColor: currentPage === pageNumber ? "#ccc" : "",
              }}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="pag-button"
            onClick={handleNext}
            disabled={currentPage === totalPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default PostList;