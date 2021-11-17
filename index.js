const trianglify = require('trianglify');

exports.handler = async function http(req) {
	console.log({ req });

	let seed;

	let triangle;
	try {
		const url = req.requestContext.http.path.split('/');
		seed = url[url.length - 1].split('.')[0];
	} catch (error) {
		seed = '0x0000000000000000000000000000000000000000';
	}

	triangle = trianglify({
		width: 256,
		height: 256,
		seed,
	});
	const headers = { 'Content-Type': 'image/svg+xml' };
	const svg = triangle.toSVG();

	const svgString = svg.toString();

	return {
		statusCode: 200,
		headers,
		body: svgString,
	};
};
