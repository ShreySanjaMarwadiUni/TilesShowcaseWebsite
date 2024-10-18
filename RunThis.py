import http.server
import socketserver
import webbrowser
import os

# Define the port and the directory to serve
PORT = 8000
DIRECTORY = os.getcwd()  # Get the current working directory

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Create the server
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")

    webbrowser.open(f"http://localhost:{PORT}/index.html")
    
    # Start the server
    httpd.serve_forever()
