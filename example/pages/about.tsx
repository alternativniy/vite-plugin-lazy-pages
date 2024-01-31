import { Link } from "react-router-dom"

import data from '../large-file.json';

export default function About() {
  return (
    <div>
      <h1>About</h1>
      {data[0].id}
      <Link to="/">to Home</Link>
    </div>
  )
}