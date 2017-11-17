
function OnAndOff(flag)
{if(flag==0)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Settings").style.display="none";document.getElementById("Tools").style.display="none";document.getElementById("Recommended").style.display="none";document.getElementById("ContactForm").style.display="none";}
else if(flag==1)
{document.getElementById("mydirectionsPanel").style.display="block";document.getElementById("IO").style.display="none";document.getElementById("Settings").style.display="none";document.getElementById("Tools").style.display="none";document.getElementById("Recommended").style.display="none";document.getElementById("ContactForm").style.display="none";}
else if(flag==2)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="block";document.getElementById("Settings").style.display="none";document.getElementById("Tools").style.display="none";document.getElementById("Recommended").style.display="none";document.getElementById("ContactForm").style.display="none";}
else if(flag==3)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Settings").style.display="block";document.getElementById("Tools").style.display="none";document.getElementById("Recommended").style.display="none";document.getElementById("ContactForm").style.display="none";}
else if(flag==4)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Settings").style.display="none";document.getElementById("Tools").style.display="block";document.getElementById("Recommended").style.display="none";document.getElementById("ContactForm").style.display="none";}
else if(flag==5)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Settings").style.display="none";document.getElementById("Tools").style.display="none";document.getElementById("Recommended").style.display="block";document.getElementById("ContactForm").style.display="none";readAllCurated();}
else if(flag==6)
{document.getElementById("mydirectionsPanel").style.display="none";document.getElementById("IO").style.display="none";document.getElementById("Settings").style.display="none";document.getElementById("Tools").style.display="none";document.getElementById("Recommended").style.display="none";document.getElementById("ContactForm").style.display="block";}
    return;}