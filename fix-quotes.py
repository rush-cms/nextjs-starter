#!/usr/bin/env python3
import re

with open('src/components/ui/select.tsx', 'r') as f:
	content = f.read()

content = re.sub(r'cn\("([^"]+)"', r"cn('\1'", content)
content = re.sub(r'className="([^"]+)"', r"className='\1'", content)
content = re.sub(r'"([^"]+)"(?=,\s*className)', r"'\1'", content)
content = re.sub(r'&&\s*"([^"]+)"', r"&& '\1'", content)

with open('src/components/ui/select.tsx', 'w') as f:
	f.write(content)

print('Fixed quotes in select.tsx')
