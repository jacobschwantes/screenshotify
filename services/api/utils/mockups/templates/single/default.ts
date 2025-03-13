
const styles = `body {
  display: flex;
  padding: 3rem;
  background-color: {{backgroundColor}};
  justify-content: center;
  align-items: center;
  height: 720px;
  width: 1280px;
}
.margin {
  margin-left: -20rem;
}
.screenshot {
  object-fit: cover;
  width: 60%;
  height: 60%;
  transform: translate3d(0px, -16px, 0px) rotateX(51deg) rotateZ(43deg);
  transform-style: preserve-3d;
  border-radius: 32px;
  box-shadow: 1px 1px 0 1px #f9f9fb, -1px 0 28px 0 rgba(34, 33, 81, 0.01),
    28px 28px 28px 0 rgba(34, 33, 81, 0.25);
}`;
const template = (
  `<html>
    <head>
      <style>
        ${styles}
      </style>
    </head>
    <body>
      <img class="screenshot" src="{{imageSource}}" />
      <img class="screenshot margin" src="{{imageSource}}" />
    </body>
  </html>`
);
export default template

