function createLogo(container) {
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');

    // Create a circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', '#4285F4');
    svg.appendChild(circle);

    // Add a star for the "rank" part
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    star.setAttribute('points', '50 20, 61 43, 87 43, 66 58, 74 82, 50 68, 26 82, 34 58, 13 43, 39 43');
    star.setAttribute('fill', '#FBBC05');
    svg.appendChild(star);

    // Add text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '50');
    text.setAttribute('y', '95');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '14');
    text.setAttribute('fill', 'white');
    text.textContent = 'Reviews';
    svg.appendChild(text);

    // Append SVG to container
    container.appendChild(svg);

    return svg;
}

module.exports = {
    createLogo
};