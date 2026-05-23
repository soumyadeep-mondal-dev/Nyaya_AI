#!/usr/bin/env bash
set -e

(cd backend && python main.py) &

sleep 3

echo "Nyaya AI running at http://localhost:5173"
(cd frontend && npm run dev)
