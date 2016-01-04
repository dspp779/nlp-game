from django.shortcuts import render
from datetime import datetime
from models import Post

def index(request):
    return render(request, 'index.html', {
        'current_time': datetime.now(),
    })

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    return render(request, 'post.html', {'post': post})