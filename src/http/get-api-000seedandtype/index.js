const trianglify = require('trianglify');
var concat = require('concat-stream');

exports.handler = async function http(req) {
	let seed;
	let type;

	try {
		const url = req.requestContext.http.path.split('/');
		const seedAndType = url[url.length - 1].split('.');
		type = seedAndType.pop();
		seed = seedAndType.join('.');
		if (!['png', 'svg'].includes(type)) {
			type = 'png';
		}
	} catch (error) {
		seed = '0x0000000000000000000000000000000000000000';
	}

	const triangle = trianglify({
		width: 256,
		height: 256,
		seed,
	});

	if (type === 'svg') {
		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'image/svg+xml',
			},
			body: triangle.toSVG().toString(),
		};
	}
	const canvas = triangle.toCanvas();
	let png;

	const readStream = canvas.createPNGStream();
	const pngStream = concat((buf) => {
		png = buf;
	});

	readStream.on('error', handleError);
	await readStream.pipe(pngStream);

	function handleError(err) {
		// handle your error appropriately here, e.g.:
		console.error(err); // print the error to STDERR
		process.exit(1); // exit program with non-zero exit code
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'image/png',
		},
		body: png.toString('base64'),
		isBase64Encoded: true,
	};
};
