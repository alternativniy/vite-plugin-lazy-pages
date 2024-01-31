import { Link } from "react-router-dom"

export default function Menu() {
  return (
    <div className="menu">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/products">Products</Link>
      <Link to="/products/1">Detail Product</Link>
    </div>
  )
}