import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
//
import { Link, Router } from 'components/Router'
import Dynamic from 'containers/Dynamic'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faTwitter, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
library.add(fab)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './app.css'
import 'highlight.js/styles/github.css';

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Root>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/blog">Blog</Link>
        <a href="https://twitter.com/yogidevbear"><FontAwesomeIcon icon={faTwitter} /></a>
        <a href="https://github.com/yogidevbear"><FontAwesomeIcon icon={faGithub} /></a>
        <a href="https://www.linkedin.com/in/andrewjackson123/"><FontAwesomeIcon icon={faLinkedinIn} /></a>
      </nav>
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            <Dynamic path="dynamic" />
            <Routes path="*" />
          </Router>
        </React.Suspense>
        <FontAwesomeIcon icon="coffee" />
      </div>
    </Root>
  )
}

export default App
