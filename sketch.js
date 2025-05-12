let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

let uvMapImage;

let triangulation;
let uvCoords;

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
  uvMapImage = loadImage("下載.png");
}

function setup() {
  createCanvas(640, 480, WEBGL);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  // Get the Coordinates for the uv mapping
  triangulation = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function draw() {
  // 清除畫布，避免殘留上一幀的圖像
  background(51);

  // 將畫布的原點移動到左上角
  translate(-width / 2, -height / 2);

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // 繪製所有三角形
    noStroke();
    texture(uvMapImage);
    textureMode(NORMAL);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangulation.length; i++) {
      let indexA = triangulation[i][0];
      let indexB = triangulation[i][1];
      let indexC = triangulation[i][2];
      let a = face.keypoints[indexA];
      let b = face.keypoints[indexB];
      let c = face.keypoints[indexC];
      const uvA = { x: uvCoords[indexA][0], y: uvCoords[indexA][1] };
      const uvB = { x: uvCoords[indexB][0], y: uvCoords[indexB][1] };
      const uvC = { x: uvCoords[indexC][0], y: uvCoords[indexC][1] };
      vertex(a.x, a.y, uvA.x, uvA.y);
      vertex(b.x, b.y, uvB.x, uvB.y);
      vertex(c.x, c.y, uvC.x, uvC.y);
    }
    endShape();
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
