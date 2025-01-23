// Web�J�����̋N��
const video = document.getElementById('video');
let contentWidth;
let contentHeight;

const media = navigator.mediaDevices.getUserMedia({ audio: false, video: {width:640, height:480} })
   .then((stream) => {
      video.srcObject = stream;
      video.onloadeddata = () => {
         video.play();
         contentWidth = video.clientWidth;
         contentHeight = video.clientHeight;
         canvasUpdate();
         checkImage();
      }
   }).catch((e) => {
      console.log(e);
   });

// �J�����f���̃L�����o�X�\��
const cvs = document.getElementById('camera-canvas');
const ctx = cvs.getContext('2d');
const canvasUpdate = () => {
   cvs.width = contentWidth;
   cvs.height = contentHeight;
   ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
   requestAnimationFrame(canvasUpdate);
}

// QR�R�[�h�̌��o
const rectCvs = document.getElementById('rect-canvas');
const rectCtx =  rectCvs.getContext('2d');
const checkImage = () => {
   // imageData�����
   const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
   // jsQR�ɓn��
   const code = jsQR(imageData.data, contentWidth, contentHeight);

   // ���o���ʂɍ��킹�ď��������{
   if (code) {
      console.log("QRcode��������܂���", code);
      drawRect(code.location);
      document.getElementById('qr-msg').textContent = `QR�R�[�h�F${code.data}`;
   } else {
      console.log("QRcode��������܂���c", code);
      rectCtx.clearRect(0, 0, contentWidth, contentHeight);
      document.getElementById('qr-msg').textContent = `QR�R�[�h: ������܂���`;
   }
   setTimeout(()=>{ checkImage() }, 500);
}

// �l�ӌ`�̕`��
const drawRect = (location) => {
   rectCvs.width = contentWidth;
   rectCvs.height = contentHeight;
   drawLine(location.topLeftCorner, location.topRightCorner);
   drawLine(location.topRightCorner, location.bottomRightCorner);
   drawLine(location.bottomRightCorner, location.bottomLeftCorner);
   drawLine(location.bottomLeftCorner, location.topLeftCorner)
}

// ���̕`��
const drawLine = (begin, end) => {
   rectCtx.lineWidth = 4;
   rectCtx.strokeStyle = "#F00";
   rectCtx.beginPath();
   rectCtx.moveTo(begin.x, begin.y);
   rectCtx.lineTo(end.x, end.y);
   rectCtx.stroke();
}
