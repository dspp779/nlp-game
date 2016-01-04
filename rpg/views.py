from django.shortcuts import render

def rpg_game(request):
    return render(request, 'rpg.html')
