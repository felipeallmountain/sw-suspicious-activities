varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 lightPosition;
uniform float opacity;

void main() {
  vec3 lightDirection = normalize(lightPosition - vPosition);
  float lightIntensity = max(dot(vNormal, lightDirection), 0.0);
  vec3 finalColor = uColor * lightIntensity + 0.2;

  gl_FragColor = vec4(finalColor, opacity);
}
