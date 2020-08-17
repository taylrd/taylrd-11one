---
title: TAYLRD
subtitle: A project scaffold for getting building quickly on Eleventy. Making good use of and leveraging JAMSTACK, speed of SSG's, power of Netlify, breaking down the complexity of authentication with Identity, microservices with serverless functions, getting paid with Stripe and other musings.
layout: layouts/base.njk
---

![image](/images/sweetjam.png)

## This site is a starting point

From this point we should already have:

- [Eleventy](https://11ty.io) with a skeleton site
- A date format filter for Nunjucks based on [Luxon](https://moment.github.io/luxon)
- A tiny CSS pipeline with PostCSS
- A tiny inline JS pipeline. (<a href="#" class="btn-log">Test a console.log message</a>)
- JS [search index](/search.json) generator
- [Netlify Dev](https://www.netlify.com/products/dev) for testing [Netlify redirects](https://netlify.com/docs/redirects/)
- Serverless (FaaS) development pipeline with [Netlify Dev](https://www.netlify.com/products/dev) and [Netlify Functions](https://www.netlify.com/products/functions)



## Post pages

The pages found in in the posts

<ul class="listing">
{%- for page in collections.post -%}
  <li>
    <a href="{{ page.url }}">{{ page.data.title }}</a> -
    <time datetime="{{ page.date }}">{{ page.date | dateDisplay("LLLL d, y") }}</time>
  </li>
{%- endfor -%}
</ul>

<!-- ## Links from an external data source

These links were sourced from [hawksworx.com](https://www.hawksworx.com/feed.json) at build time.

<ul class="listing">
{%- for item in hawksworx.entries.slice(0,5) -%}
  <li>
    <a href="{{ item.link }}">{{ item.title }}</a>
  </li>
{%- endfor -%}
</ul> -->


## Prerequisite

- [Node and NPM](https://nodejs.org/)

## Running locally

```bash
# install the dependencies
npm install

# External data sources can be stashed locally
npm run seed

# It will then be available locally for building with
npm run start
```

## Add some Netlify helpers
Netlify Dev adds the ability to use Netlify redirects, proxies, and serverless functions.

```bash
# install the Netlify CLI in order to get Netlify Dev
npm install -g netlify-cli

# run a local server with some added Netlify sugar in front of Eleventy
netlify dev
```

A serverless functions pipeline is included via Netlify Dev. By running `netlify dev` you'll be able to execute any of your serverless functions directly like this:

- [/.netlify/functions/hello](/.netlify/functions/hello)
- [/.netlify/functions/fetch-joke](/.netlify/functions/fetch-joke)

### Redirects and proxies

Netlify's Redirects API can provide friendlier URLs as proxies to these URLs.

- [/api/hello](/api/hello)
- [/api/fetch-joke](/api/fetch-joke)

<h2 style="text-align:center;margin-bottom:1.5rem">Subscription Plans</h2>

<div class="user-info">
  <button id="left">Log In</button>
  <button id="right">Sign Up</button>
</div>

<div class="sub-content">
  <div class="content">
    <h2>Free Content</h2>
    <div class="free"></div>
  </div>
  <div class="content">
    <h2>Pro Content</h2>
    <div class="pro"></div>
  </div>
  <div class="content">
    <h2>Premium Content</h2>
    <div class="premium"></div>
  </div>
</div>

<template id="content">
  <figure class="content-display">
    <img />
      <figcaption>
        <p class="credit"></p>
      </figcaption>
  </figure>
</template>

<script>
const button1 = document.getElementById('left');
const button2 = document.getElementById('right');

const login = () => netlifyIdentity.open('login');
const signup = () => netlifyIdentity.open('signup');

// by default, add login and signup functionality
button1.addEventListener('click', login);
button2.addEventListener('click', signup);

const updateUserInfo = (user) => {
  const container = document.querySelector('.user-info');

  //cloning the buttons removes existing event listeners
  const b1 = button1.cloneNode(true);
  const b2 = button2.cloneNode(true);

  //empty the user info div
  container.innerHTML = '';

  if (user) {
    b1.innerText = 'Log Out';
    b1.addEventListener('click', () => {
      netlifyIdentity.logout();
    });

    b2.innerText = 'Manage Subscription';
    b2.addEventListener('click', () => {
      //TODO handle subscription managment
    });
  } else {
    //if no one is logged in, show login/signup options
    b1.innerText = 'Log In';
    b1.addEventListener('click', login);

    b2.innerText = 'Sign Up';
    b2.addEventListener('click', signup);
  }

  //add the updated buttons back to the user info div
  container.appendChild(b1);
  container.appendChild(b2);
};

const loadSubscriptionContent = async (user) => {
  const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;

  ['free', 'pro', 'premium'].forEach((type) => {
    fetch('/.netlify/functions/get-protected-content', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type })
    })
    .then((res) => res.json())
    .then((data) => {
      const template = document.querySelector('#content');
      const container = document.querySelector(`.${type}`);

      //remove any existing content from the content containers
      const oldContent = container.querySelector('.content-display');
      if (oldContent) {
        container.removeChild(oldContent);
      }

      const content = template.content.cloneNode(true);

      const img = content.querySelector('img');
      img.src = data.src;
      img.alt = data.alt;

      const credit = content.querySelector('.credit');
      credit.href = data.creditlink;


      const caption = content.querySelector('figcaption');
      caption.innerText = data.message;
      caption.appendChild(credit);

      container.appendChild(content);
    });
  });
}

const handleUserStateChange = (user) => {
  updateUserInfo(user);
  loadSubscriptionContent(user);
};

netlifyIdentity.on('init', handleUserStateChange);
netlifyIdentity.on('login', handleUserStateChange);
netlifyIdentity.on('logout', handleUserStateChange);


</script>