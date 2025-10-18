import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { UserPlus, Trash2, Shield, Crown, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';

export default function Team() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('');
  const [teamData, setTeamData] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate(`/${locale}/auth/login`);
        return;
      }

      // Check user plan
      const { data: userApp } = await supabase
        .from('users_app')
        .select('plan')
        .eq('id', user.id)
        .single();

      setUserPlan(userApp?.plan || '');

      if (userApp?.plan !== 'business' && userApp?.plan !== 'enterprise') {
        toast.error(t('team.businessPlanRequired'));
        navigate(`/${locale}/dashboard/billing`);
        return;
      }

      await loadTeamData(user.id);
    } catch (error) {
      console.error('Error checking access:', error);
      toast.error(t('team.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async (userId: string) => {
    // Get user's team
    const { data: membership } = await supabase
      .from('team_members')
      .select('*, teams(*)')
      .eq('user_id', userId)
      .single();

    if (membership) {
      setTeamData(membership);
      await loadMembers(membership.team_id);
      await loadInvitations(membership.team_id);
    }
  };

  const loadMembers = async (teamId: string) => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*, users_app(business_email)')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading members:', error);
    } else {
      setMembers(data || []);
    }
  };

  const loadInvitations = async (teamId: string) => {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading invitations:', error);
    } else {
      setInvitations(data || []);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !teamData) return;

    setIsInviting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('invite-team-member', {
        body: {
          team_id: teamData.team_id,
          email: inviteEmail,
          role: inviteRole,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast.success(t('team.inviteSent'));
      setInviteEmail('');
      setInviteRole('member');
      await loadInvitations(teamData.team_id);
    } catch (error: any) {
      console.error('Error inviting member:', error);
      toast.error(error.message || t('team.errorInviting'));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!teamData || !confirm(t('team.confirmRemove'))) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke('manage-team-member', {
        body: {
          action: 'remove',
          team_id: teamData.team_id,
          member_id: memberId,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast.success(t('team.memberRemoved'));
      await loadMembers(teamData.team_id);
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.message || t('team.errorRemoving'));
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{t('loading')}</div>
      </div>
    );
  }

  const isAdmin = teamData && ['owner', 'admin'].includes(teamData.role);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('team.title')}</h1>
        <p className="text-muted-foreground">{t('team.description')}</p>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {t('team.inviteMember')}
            </CardTitle>
            <CardDescription>{t('team.inviteDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email">{t('team.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="w-32">
                <Label htmlFor="role">{t('team.role')}</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">{t('team.roles.member')}</SelectItem>
                    <SelectItem value="admin">{t('team.roles.admin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleInvite} disabled={isInviting || !inviteEmail}>
                  {isInviting ? t('sending') : t('team.sendInvite')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {invitations.length > 0 && isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>{t('team.pendingInvitations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('team.email')}</TableHead>
                  <TableHead>{t('team.role')}</TableHead>
                  <TableHead>{t('team.expires')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(invite.role)}>
                        {t(`team.roles.${invite.role}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(invite.expires_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('team.members')}</CardTitle>
          <CardDescription>
            {members.length} {t('team.totalMembers')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('team.email')}</TableHead>
                <TableHead>{t('team.role')}</TableHead>
                <TableHead>{t('team.joined')}</TableHead>
                {isAdmin && <TableHead className="text-right">{t('actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.users_app?.business_email || member.user_id}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1 w-fit">
                      {getRoleIcon(member.role)}
                      {t(`team.roles.${member.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      {member.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}