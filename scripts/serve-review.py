#!/usr/bin/env python3
"""Local static preview with byte ranges so browser video seeking matches hosting."""
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import os,re,sys
class Handler(SimpleHTTPRequestHandler):
 extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.vtt':'text/vtt; charset=utf-8'}
 def end_headers(self):
  self.send_header('Cache-Control','no-store');self.send_header('Accept-Ranges','bytes');super().end_headers()
 def send_head(self):
  self.byte_range=None;path=self.translate_path(self.path)
  if not os.path.isfile(path) or not self.headers.get('Range'):return super().send_head()
  match=re.fullmatch(r'bytes=(\d+)-(\d*)',self.headers['Range'])
  if not match:return super().send_head()
  f=open(path,'rb');size=os.fstat(f.fileno()).st_size;start=int(match[1]);end=min(int(match[2]) if match[2] else size-1,size-1)
  if start> end:
   f.close();self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
  self.byte_range=(start,end);self.send_response(206);self.send_header('Content-type',self.guess_type(path));self.send_header('Content-Length',str(end-start+1));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.end_headers();f.seek(start);return f
 def copyfile(self,source,output):
  if self.byte_range:
   remaining=self.byte_range[1]-self.byte_range[0]+1
   while remaining:
    chunk=source.read(min(65536,remaining))
    if not chunk:break
    output.write(chunk);remaining-=len(chunk)
  else:super().copyfile(source,output)
 def log_message(self,*args):pass
if __name__=='__main__':
 os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
 ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1]) if len(sys.argv)>1 else 5542),Handler).serve_forever()
