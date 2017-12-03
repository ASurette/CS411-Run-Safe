function OnAndOff(flag)
{if(flag==0)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Tools").style.display="none";}
else if(flag==1)
{document.getElementById("mydirectionsPanel").style.display="block";document.getElementById("IO").style.display="none";document.getElementById("Tools").style.display="none";}
else if(flag==2)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Tools").style.display="block";}
    return;}