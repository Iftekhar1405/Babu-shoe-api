import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <head>
    <style>
        body {
            background-color: #000;
            color: #74ee15;
            font-family: 'Courier New', monospace;
            height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }

        .cursor {
            display: inline-block;
            width: 5px;
            height: 15px;
            background-color: #0f0;
            margin-left: 5px;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 49% {
                opacity: 1;
            }
            50%, 100% {
                opacity: 0;
            }
        }

        .matrix-bg {
            opacity: 0.1;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 255, 0, 0.15) 0px,
                rgba(0, 255, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
        }
    </style>
</head>
<body>
    <div class="matrix-bg"></div>
    <div class="container">
        <h1>Welcome to Babu Shoes API</span></h1>
        <h4>We are ready to serve....<span class="cursor"></span></h4>
    </div>
</body>
    `;
  }
}