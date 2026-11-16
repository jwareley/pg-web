INSERT INTO beta_tasks (pack_key,task_key,title,instructions,sort_order,required) VALUES
('common','common-install','Install and launch','Install the beta, open it, and record any crash or unexpected launch state.',1,1),
('common','common-midi','Connect to the M3','Connect using your normal MIDI setup and confirm detection and connection status.',2,1),
('common','common-nav','Navigate the core views','Open Play, Edit, and the available tabs. Note anything confusing or difficult to read.',3,1),
('common','common-patches','Select Programs and Combinations','Select multiple patches and confirm the M3 changes correctly.',4,1),
('common','common-reconnect','Disconnect and reconnect','Remove the MIDI connection, reconnect it, and verify recovery without restarting.',5,1),
('common','common-stability','Complete a 30-minute stability session','Use PatchGrid continuously and record crashes, freezes, lag, or lost MIDI communication.',6,1),
('hans','hans-setup','Compare connection methods','Compare direct USB, USB hub/Camera Connection Kit, and ESI MIDIMATE eX MIDI interface setups.',1,1),
('hans','hans-review','Submit an interoperability review','Record the most useful workflow improvements and any setup-specific issue.',2,1),
('goran','goran-setup','Run a long M3-88 session','Run a long session and verify repeated patch changes, recovery, and live-style use.',1,1),
('goran','goran-review','Report live workflow confidence','Report whether the current build is reliable enough for rehearsal use and why.',2,1),
('edgardo','edgardo-setup','Test expanded M3-61 coverage','Test direct USB with EXB-RADIAS and EXB-M256 installed, including expanded sound coverage.',1,1),
('edgardo','edgardo-review','Check expanded sound mapping','Record missing sounds, incorrect names, wrong selections, or MIDI delays.',2,1),
('nehuel','nehuel-setup','Use PatchGrid as the primary interface','Use PatchGrid with the Ugreen USB-C hub and identify any task that still requires the M3 screen.',1,1),
('nehuel','nehuel-review','Review replacement-interface usability','Report readability, button size, navigation clarity, and error recovery.',2,1),
('thomas','thomas-setup','Review expert Korg workflow','Review terminology, bank mapping, live sound selection, and professional usability.',1,1),
('thomas','thomas-review','Submit an expert review','Provide three strengths, three weaknesses, and the most important improvement.',2,1),
('fernando','fernando-setup','Test CME WIDI Bluetooth MIDI','Using the M3-61 with EXB-RADIAS and EXB-M256, test the iPad mini 5 Lightning setup with the CME WIDI Bluetooth MIDI connection. Verify pairing, patch changes, latency, dropped messages, and reconnection after the wireless link is interrupted.',1,1),
('fernando','fernando-review','Review wireless MIDI reliability','Record whether the CME WIDI workflow is reliable for normal use, including any pairing friction, latency, missed messages, or recovery problems.',2,1),
('ivan','ivan-setup','Test Lightning and hybrid MIDI paths','Using the M3-61 with EXB-RADIAS and EXB-M256, compare the iPad 9th generation Lightning setup across direct USB, an Apple adapter path, and the Korg PlugKEY 5-pin DIN interface. Verify detection, routing, patch changes, and reconnect behaviour for each path.',1,1),
('ivan','ivan-review','Review connection-path consistency','Record differences between the Lightning, adapter, and PlugKEY paths, including reliability, setup complexity, latency, and any incorrect or missing MIDI behaviour.',2,1),
('alonso','alonso-setup','Test USB-C and Yamaha Bluetooth MIDI','Using the M3-73 with EXB-M256, test the 2024 USB-C iPad setup with Yamaha Bluetooth MIDI and 5-pin DIN connections. Verify Programs, Combinations, KARMA controls, expanded M256 sounds, patch changes, and reconnection across both paths.',1,1),
('alonso','alonso-review','Review M3-73 expanded workflow','Record whether the USB-C and Yamaha MIDI workflow is reliable on the M3-73, including expanded sound coverage, control response, routing, and any device-specific issue.',2,1),
('explore','explore-open','Explore PatchGrid','Complete the expanded general beta-test questionnaire. Open each section, answer every question in its own text field, and save your answers when finished.',1,0)
ON CONFLICT(task_key) DO UPDATE SET title=excluded.title,instructions=excluded.instructions,sort_order=excluded.sort_order,required=excluded.required;
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT id,'common','Common tests' FROM beta_users WHERE role='tester' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=beta_users.id AND a.pack_key='common');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'hans','Connectivity & workflow interoperability' FROM beta_users u WHERE u.username='hans.noort' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='hans');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'goran','Long-session live workflow' FROM beta_users u WHERE u.username='goran.german' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='goran');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'edgardo','Expanded M3-61 coverage' FROM beta_users u WHERE u.username='edgardo.actis' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='edgardo');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'nehuel','Damaged-screen replacement workflow' FROM beta_users u WHERE u.username='nehuel.soriano' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='nehuel');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'thomas','Expert Korg workflow review' FROM beta_users u WHERE u.username='thomas.demicco' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='thomas');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'fernando','CME WIDI Bluetooth MIDI interoperability' FROM beta_users u WHERE u.username='fernando.pires' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='fernando');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'ivan','Lightning and hybrid MIDI interoperability' FROM beta_users u WHERE u.username='ivan.polic' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='ivan');
INSERT INTO beta_assignments (user_id,pack_key,title) SELECT u.id,'alonso','USB-C / Yamaha Bluetooth M3-73 coverage' FROM beta_users u WHERE u.username='alonso.ramos' AND NOT EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=u.id AND a.pack_key='alonso');
