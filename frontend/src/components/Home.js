import React, { useEffect } from "react";
// import MetaData from "./layout/MetaData";
import ProductItem from "./product/ProductItem";
import { useGetProductsQuery } from "../redux/api/productApi";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/customPagination";
import { useSearchParams } from "react-router-dom";
import Filter from "./layout/Filter";

const Home = () => {
  let [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const { data, isLoading, error, isError } = useGetProductsQuery({
    page,
    keyword,
    min,
    max,
    category,
    ratings,
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching products:", error);
      toast.error(error?.data?.message || "An error occurred");
    }
  }, [isError, error]);

  useEffect(() => {
    console.log("Fetched data:", data); // Debugging statement
  }, [data]);

  const columnSize = keyword ? 3 : 4;

  if (isLoading) return <Loader />;

  return (
    <>
      {/* <MetaData title={"Buy Best Products online"} /> */}
      <div className="row">
        {keyword && (
          <div className={`col-6 col-md-${columnSize} mt-5`}>
            <Filter />
          </div>
        )}
        <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
          <h1 id="products_heading" className="text-secondary">
            {keyword
              ? `${data?.products?.length} Products found with keyword : ${keyword}`
              : "Latest Products"}
          </h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  columnSize={columnSize}
                />
              ))}
            </div>
          </section>

          {data && (
            <CustomPagination
              resPerPage={data.resPerPage}
              filteredProductsCount={data.filteredProductsCount}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
