"""Memory-safe drop-in replacement for ``ranged_fileresponse.RangedFileResponse``.

django-ranged-fileresponse 0.1.2 determines the file size with ``len(file.read())``,
i.e. it reads the *whole* file into memory on every request. For multi-GB videos that
are streamed with many Range requests this exhausts RAM within minutes (we saw ~97 GB).
Here the size is taken with seek/tell instead; everything else is inherited unchanged.
"""
import os

from ranged_fileresponse import RangedFileReader as _RangedFileReader
from ranged_fileresponse import RangedFileResponse as _RangedFileResponse


class RangedFileReader(_RangedFileReader):
    def __init__(self, file_like, start=0, stop=float('inf'), block_size=None):
        self.f = file_like
        self.f.seek(0, os.SEEK_END)
        self.size = self.f.tell()
        self.f.seek(0)
        self.block_size = block_size or _RangedFileReader.block_size
        self.start = start
        self.stop = stop


class RangedFileResponse(_RangedFileResponse):
    def __init__(self, request, file, *args, **kwargs):
        self.ranged_file = RangedFileReader(file)
        # skip _RangedFileResponse.__init__ (it would build the leaky reader) and call FileResponse directly
        super(_RangedFileResponse, self).__init__(self.ranged_file, *args, **kwargs)

        if 'HTTP_RANGE' in request.META:
            self.add_range_headers(request.META['HTTP_RANGE'])
