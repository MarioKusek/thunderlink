FasdUAS 1.101.10   ��   ��    k             l      ��  ��   ��

1. ovu skriptu staviti u novu i snimiti kao app u Application folder
2. u Contents/Resources ThunderlinkOpenerJS.scpt
3. u ContentsInfo.plist dodati:
        <key>CFBundleURLTypes</key>
        <array>
                <dict>
                        <key>CFBundleURLName</key>
                        <string>Thunderlink</string>
                        <key>CFBundleURLSchemes</key>
                        <array>
                                <string>tthunderlink</string>
                        </array>
                </dict>
        </array>

4. System Preferences -> Security & Privacy -> Privacy tab -> Acessibility -> dodati ThunderlinkOpener.app


     � 	 	. 
 
 1 .   o v u   s k r i p t u   s t a v i t i   u   n o v u   i   s n i m i t i   k a o   a p p   u   A p p l i c a t i o n   f o l d e r 
 2 .   u   C o n t e n t s / R e s o u r c e s   T h u n d e r l i n k O p e n e r J S . s c p t 
 3 .   u   C o n t e n t s I n f o . p l i s t   d o d a t i : 
                 < k e y > C F B u n d l e U R L T y p e s < / k e y > 
                 < a r r a y > 
                                 < d i c t > 
                                                 < k e y > C F B u n d l e U R L N a m e < / k e y > 
                                                 < s t r i n g > T h u n d e r l i n k < / s t r i n g > 
                                                 < k e y > C F B u n d l e U R L S c h e m e s < / k e y > 
                                                 < a r r a y > 
                                                                 < s t r i n g > t t h u n d e r l i n k < / s t r i n g > 
                                                 < / a r r a y > 
                                 < / d i c t > 
                 < / a r r a y > 
 
 4 .   S y s t e m   P r e f e r e n c e s   - >   S e c u r i t y   &   P r i v a c y   - >   P r i v a c y   t a b   - >   A c e s s i b i l i t y   - >   d o d a t i   T h u n d e r l i n k O p e n e r . a p p 
 
 
   
  
 l     ��������  ��  ��     ��  i         I     �� ��
�� .GURLGURLnull��� ��� TEXT  o      ���� 0 myurl myUrl��    k     -       l     ��  ��     display dialog myUrl     �   ( d i s p l a y   d i a l o g   m y U r l      Q     +     k           I   �� ��
�� .JonspClpnull���     ****  o    ���� 0 myurl myUrl��         r   	  ! " ! I  	 �� #��
�� .sysorpthalis        TEXT # m   	 
 $ $ � % % 0 T h u n d e r l i n k O p e n e r J S . s c p t��   " l      &���� & o      ���� 0 script_file  ��  ��      ' ( ' r     ) * ) I   �� +��
�� .sysoloadscpt        file + o    ���� 0 script_file  ��   * o      ���� 0 this_script   (  ,�� , I   �� -��
�� .sysodsct****        scpt - o    ���� 0 this_script  ��  ��    R      �� .��
�� .ascrerr ****      � **** . o      ���� 0 err  ��    I  & +�� /��
�� .sysodlogaskr        TEXT / o   & '���� 0 err  ��     0�� 0 l  , ,��������  ��  ��  ��  ��       �� 1 2��   1 ��
�� .GURLGURLnull��� ��� TEXT 2 �� ���� 3 4��
�� .GURLGURLnull��� ��� TEXT�� 0 myurl myUrl��   3 ���������� 0 myurl myUrl�� 0 script_file  �� 0 this_script  �� 0 err   4 �� $������������
�� .JonspClpnull���     ****
�� .sysorpthalis        TEXT
�� .sysoloadscpt        file
�� .sysodsct****        scpt�� 0 err  ��  
�� .sysodlogaskr        TEXT�� .  �j  O�j E�O�j E�O�j W X  �j OP ascr  ��ޭ