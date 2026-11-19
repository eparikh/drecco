+++
title = "Diamond Game"

[extra]
team="Team Omicron (Zachary DeStefano and Graham Todd)"
thumbnail="thumbnail.png"
+++
<style>
  table, th, td {
    border: 5px inset #3D348B;
    border-collapse: collapse;
    padding: 10px;
    background-color: #7678ED;
    box-shadow: 0 10px 10px rgba(0,0,0,0.2);
    font-size: 0px;
    line-height: 1;
  }
  .corner {
    background-color: #ECC30B;
  }

  .free_slot {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    visibility: hidden;
    background-color: #7678ED;
  }
  .piece1 {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 1px solid white;
    box-shadow: 1px 2px 1px 2px rgba(74, 75, 75, 1);
    background:linear-gradient(rgba(255, 255, 255, 1), rgba(216, 210, 216, 1));
  }
  table {
    margin: auto;
  }
</style>

<h3>Instructions:</h3>
<p>Players take turns placing stones adjacent to previously placed pieces.</p>
<p>There are two ways to win:</p>
<ol>
<li>
<p>Surround a square with 4 of your pieces (creating a diamond).</p>
<table>
<tbody>
<tr>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="piece1" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
</tr>
<tr>
<td><input class="piece1" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="piece1" type="button" disabled=""></td>
</tr>
<tr>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="piece1" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
</tr>
</tbody>
</table>
</li>
<li>
<p>Place a piece in one of the corners.</p>
<table>
<tbody>
<tr>
<td class="corner"><input class="piece1" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
</tr>
<tr>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
</tr>
<tr>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
<td><input class="free_slot" type="button" disabled=""></td>
</tr>
</tbody>
</table>
</li>
</ol>
