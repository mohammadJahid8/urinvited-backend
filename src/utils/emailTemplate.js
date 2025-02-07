export const template = (subject, body) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #e3e3e3;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .content {
        font-size: 14px;
        color: #333333;
        line-height: 1.6;
        text-align: left;
        margin-bottom: 20px;
      }
      .cta {
        display: block;
        width: 100%;
        padding: 10px 0;
        background-color: #f8f9fa;
        color: #000000;
        font-weight: bold;
        font-size: 16px;
        border: 1px solid #e3e3e3;
        border-radius: 4px;
        text-transform: uppercase;
        text-align: center;
        cursor: default;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        ${subject}
      </div>
      <div class="content">
        ${body}
      </div>
      <div class="cta">
        <img src="https://i.ibb.co.com/PzhSG03Y/urinvited-logo.png" alt="URINVITED Logo" />
      </div>
    </div>
  </body>
</html>`;
};
