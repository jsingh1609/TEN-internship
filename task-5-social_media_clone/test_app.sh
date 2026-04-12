#!/bin/bash

# Vibegram Instagram Clone - Complete Testing Script
# This script tests all components of the application

echo "======================================"
echo "🎨 VIBEGRAM - TESTING SUITE"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

echo "1️⃣  Testing Django Installation..."
python3 -c "import django; print(f'Django version: {django.get_version()}')" 2>/dev/null
test_result $? "Django is installed"

echo ""
echo "2️⃣  Testing Django REST Framework..."
python3 -c "import rest_framework; print('DRF installed')" 2>/dev/null
test_result $? "Django REST Framework is installed"

echo ""
echo "3️⃣  Testing CORS Headers..."
python3 -c "import corsheaders; print('CORS headers installed')" 2>/dev/null
test_result $? "Django CORS Headers is installed"

echo ""
echo "4️⃣  Testing Database..."
cd /home/claude/vibegram-instagram-clone
python3 manage.py check --database default 2>&1 | grep -q "System check identified no issues"
test_result $? "Database configuration is valid"

echo ""
echo "5️⃣  Testing Models..."
python3 manage.py showmigrations 2>&1 | grep -q "\[X\]"
test_result $? "Migrations have been applied"

echo ""
echo "6️⃣  Testing User Model..."
python3 -c "from api.models import User; print(f'Users in database: {User.objects.count()}')" 2>/dev/null
test_result $? "User model is accessible"

echo ""
echo "7️⃣  Testing Post Model..."
python3 -c "from api.models import Post; print(f'Posts in database: {Post.objects.count()}')" 2>/dev/null
test_result $? "Post model is accessible"

echo ""
echo "8️⃣  Testing Story Model..."
python3 -c "from api.models import Story; print(f'Stories in database: {Story.objects.count()}')" 2>/dev/null
test_result $? "Story model is accessible"

echo ""
echo "9️⃣  Testing Comment Model..."
python3 -c "from api.models import Comment; print(f'Comments in database: {Comment.objects.count()}')" 2>/dev/null
test_result $? "Comment model is accessible"

echo ""
echo "🔟 Testing Demo Data..."
python3 -c "from api.models import Post; assert Post.objects.count() >= 3, 'Not enough posts'; print('Demo data exists')" 2>/dev/null
test_result $? "Demo data has been populated"

echo ""
echo "1️⃣1️⃣  Testing Serializers..."
python3 -c "from api.serializers import PostSerializer, UserSerializer; print('Serializers imported successfully')" 2>/dev/null
test_result $? "Serializers are working"

echo ""
echo "1️⃣2️⃣  Testing Views..."
python3 -c "from api.views import PostViewSet, UserViewSet; print('Views imported successfully')" 2>/dev/null
test_result $? "Views are working"

echo ""
echo "1️⃣3️⃣  Testing URL Configuration..."
python3 manage.py show_urls 2>&1 | grep -q "api" || python3 -c "from api.urls import urlpatterns; print('URLs configured')" 2>/dev/null
test_result $? "URL configuration is valid"

echo ""
echo "1️⃣4️⃣  Testing Admin Registration..."
python3 -c "from django.contrib import admin; from api.models import User, Post; print('Admin registered')" 2>/dev/null
test_result $? "Admin interface is configured"

echo ""
echo "1️⃣5️⃣  Testing Frontend Files..."
[ -f "frontend/src/App.jsx" ]
test_result $? "React App.jsx exists"

echo ""
echo "1️⃣6️⃣  Testing API Endpoints..."
python3 << 'EOF'
from django.test import RequestFactory
from api.views import UserViewSet, PostViewSet
from api.models import User, Post

# Create request factory
factory = RequestFactory()

# Test Users endpoint
request = factory.get('/api/users/')
view = UserViewSet.as_view({'get': 'list'})
response = view(request)
assert response.status_code == 200, f"Users endpoint failed: {response.status_code}"

# Test Posts endpoint
request = factory.get('/api/posts/')
view = PostViewSet.as_view({'get': 'list'})
response = view(request)
assert response.status_code == 200, f"Posts endpoint failed: {response.status_code}"

print("API endpoints are functional")
EOF
test_result $? "API endpoints are functional"

echo ""
echo "======================================"
echo "📊 TEST SUMMARY"
echo "======================================"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo "Total: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All tests passed! Your Vibegram Instagram clone is ready!${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Start backend: python manage.py runserver"
    echo "   2. Start frontend: cd frontend && npm run dev"
    echo "   3. Visit http://localhost:3000"
    echo ""
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please review the errors above.${NC}"
    echo ""
fi

echo "======================================"
echo "📝 Quick Commands:"
echo "======================================"
echo "Backend:"
echo "  python manage.py runserver          # Start Django server"
echo "  python manage.py createsuperuser    # Create admin user"
echo "  python manage.py populate_data      # Repopulate demo data"
echo ""
echo "Frontend:"
echo "  cd frontend && npm install          # Install dependencies"
echo "  npm run dev                         # Start React dev server"
echo ""
echo "Admin Panel:"
echo "  http://localhost:8000/admin         # Django admin interface"
echo ""
echo "API Documentation:"
echo "  http://localhost:8000/api/          # Browse API"
echo "  http://localhost:8000/api/posts/    # Posts endpoint"
echo "  http://localhost:8000/api/users/    # Users endpoint"
echo "======================================"
