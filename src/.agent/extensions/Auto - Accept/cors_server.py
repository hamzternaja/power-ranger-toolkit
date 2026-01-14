#!/usr/bin/env python3
"""
Auto Accept Sound Server - CORS Enabled
Serves MP3 files with proper CORS headers for browser audio playback
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class CORSHandler(SimpleHTTPRequestHandler):
    """HTTP handler that adds CORS headers to all responses"""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format with emoji indicators"""
        print(f"[🔊] {args[0]}")

def main():
    host = '127.0.0.1'
    port = 8765
    
    print(f"\n🎵 Sound Server ready!")
    print(f"📍 Address: http://{host}:{port}")
    print(f"📁 Serving files from current directory")
    print(f"🛑 Press Ctrl+C to stop\n")
    
    try:
        server = HTTPServer((host, port), CORSHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        server.shutdown()
    except OSError as e:
        if "Address already in use" in str(e) or "10048" in str(e):
            print(f"\n❌ Error: Port {port} is already in use!")
            print("   Another server might be running.")
        else:
            print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
