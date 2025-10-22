// Boosty Supporters Generator - Templates
// Contains Jinja2-compatible templates for HTML, TXT, and Markdown output

const templates = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boosters</title>
  <style>
    body {
      font-size: 26px;
      background-color: black;
      color: white;
      text-shadow: 1px 1px 5px gray;
      margin: 0;
      padding: 0;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }

    .the-title {
      font-size: 3em;
      font-weight: bold;
    }

    .display-title-1 {
      font-size: 2em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-2 {
      font-size: 1.875em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-3 {
      font-size: 1.75em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-4 {
      font-size: 1.625em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-5 {
      font-size: 1.5em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-6 {
      font-size: 1.375em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-7 {
      font-size: 1.25em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .display-title-8 {
      font-size: 1.125em;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .group-items-1 {
      font-size: 1.75em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-2 {
      font-size: 1.625em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-3 {
      font-size: 1.5em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-4 {
      font-size: 1.375em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-5 {
      font-size: 1.25em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-6 {
      font-size: 1.125em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-7 {
      font-size: 1em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .group-items-8 {
      font-size: 0.875em;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .padding-black {
      color: rgba(0, 0, 0, 0);
      text-shadow: none;
    }

    #credits-container {
      position: relative;
      height: 100vh;
      overflow: hidden;
    }

    #credits {
      bottom: 0;
      margin-left: 50px;
      position: absolute;
      animation: scroll {{ duration }}s linear forwards;
    }

    @keyframes scroll {
      0% {
        transform: translateY(100%);
      }
      100% {
        transform: translateY(-100%);
      }
    }
  </style>
</head>
<body>
<div id="credits-container">
  <div id="credits">
    <div class="padding-black">
      {% for foo in range(padding) %}
        <div>{{ foo }}</div>
      {% endfor %}
    </div>

    <div class="the-title">{{ title }}</div>
    {% for level_name, entries in groups %}
      <div class="display-title-{{ loop.index }}">{{ level_name }}</div>
      <div class="group-items-{{ loop.index }}">
        {% for entry in entries %}
          <div>{{ entry['name'] }}</div>
        {% endfor %}
      </div>
    {% endfor %}

    <div class="padding-black">
      {% for foo in range(padding) %}
        <div>{{ foo }}</div>
      {% endfor %}
    </div>
  </div>
</div>
</body>
</html>`,

  txt: `{% for level_name, entries in groups %}

{{ level_name }}

{% for entry in entries %}{{ entry['name'] }}
{% endfor %}

{% endfor %}`,
  md: `{% for level_name, entries in groups %}
{% for i in range(loop.index) %}#{% endfor %} {{ level_name }}
{% for entry in entries %}{{ entry['name'] }}
{% endfor %}

{% endfor %}`
};