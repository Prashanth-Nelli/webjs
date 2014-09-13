var mime = exports = module.exports = {};

mime.type = [{
	extension : 'gz',
	media : 'application/gzip'
}, {
	extension : 'xml',
	media : 'application/xml'
}, {
	extension : 'pdf',
	media : 'application/pdf'
}, {
	extension : 'mp4',
	media : 'application/mp4'
}, {
	extension : 'json',
	media : 'application/json'
}, {
	extension : 'js',
	media : 'application/javascript'
}, {
	extension : 'ecmascript',
	media : 'application/ecmascript'
}, {
	extension : 'zlib',
	media : 'application/zlib'
}, {
	extension : 'zip',
	media : 'application/zip'
}, {
	extension : 'amr',
	media : 'audio/AMR'
}, {
	extension : 'mp3',
	media : 'audio/mp3'
}, {
	extension : 'asc',
	media : 'audio/asc'
}, {
	extension : 'png',
	media : 'image/png'
}, {
	extension : 'gif',
	media : 'image/gif'
}, {
	extension : 'jpeg',
	media : 'image/jpeg'
}, {
	extension : 'jpg',
	media : 'image/jpg'
}, {
	extension : 'svg',
	media : 'image/svg+xml'
}, {
	extension : 'tiff',
	media : 'image/tiff'
}, {
	extension : 'css',
	media : 'text/css'
}, {
	extension : 'csv',
	media : 'text/csv'
}, {
	extension : 'html',
	media : 'text/html'
}, {
	extension : 'rtf',
	media : 'text/rtf'
}, {
	extension : 'xml',
	media : 'text/xml'
}, {
	extension : '3gpp',
	media : 'video/3gpp'
}, {
	extension : 'mp4',
	media : 'video/mp4'
}, {
	extension : 'avi',
	media : 'video/avi'
}, {
	extension : 'mpeg',
	media : 'video/mpeg'
}];

mime.lookup = function(input) {
	var extension = input.substring(input.lastIndexOf('.') + 1, input.length);
	var length = mime.type.length,loc=-1
	for (var i = 0; i < length; i++) {
		if(mime.type[i]['extension']==extension){
			loc=i;
			break;
		}
	}
	return ((loc!==-1)?mime.type[loc]['media']:'');
}

